package com.eustacio.seedstartermanager.web.storageManager;

import com.eustacio.seedstartermanager.util.PropertiesUtils;
import com.sun.istack.internal.NotNull;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.Properties;

/**
 * @author Wallison S. Freitas
 */
@Component
public class StandardServerStorageManager implements ServerStorageManager {

    private Hashtable<String, String> allowedExtensions;

    @Override
    public File transferFileToServer(MultipartFile file, String newFileName) {
        return null;
    }

    protected String sanitizeFileName(String fileName) {
        if (StringUtils.hasText(fileName)) {
            return fileName
                    .toLowerCase()            // Change all characters to lowercase
                    .trim()                   // Removes any empty space on the start or end of the String
                    .replaceAll(" +", "_")    // Replaces all empty spaces with a underscore
                    .replaceAll("\\W+", "");  // Removes all characters that is not a-z, A-Z, 0-9 or _
        }

        // Returns null if the 'fileName' parameter is null, empty or contains only white spaces
        return null;
    }

    @NotNull
    protected Hashtable<String, String> getAllAllowedFileExtensions() {
        if (allowedExtensions == null) {
            allowedExtensions = new Hashtable<>();

            Properties applicationProperties = PropertiesUtils.getApplicationProperties();
            applicationProperties.forEach((key, value) -> {
                String propertyKey = key.toString();
                if (propertyKey.startsWith("server.upload.allowed_extensions.")) {
                    String[] extensions = splitStringOnAnySpecialCharacter(value.toString());
                    String fileType = propertyKey.substring(propertyKey.lastIndexOf('.'));
                    String location = applicationProperties.getProperty("server.upload.location" + fileType);
                    if (location == null) {
                        throw new IllegalStateException(String.format("Cannot find the appropriate " +
                                        "folder to save files of type(s) %s, did you remember of provides " +
                                        "an property named '%s' on the 'application.properties' file?",
                                Arrays.toString(extensions), "server.upload.location" + fileType));
                    }

                    for (String extension : extensions) {
                        allowedExtensions.put(extension, location);
                    }
                }
            });
        }

        return allowedExtensions;
    }

    protected String[] splitStringOnAnySpecialCharacter(String str) {
        return str.split("\\W+");
    }

}
