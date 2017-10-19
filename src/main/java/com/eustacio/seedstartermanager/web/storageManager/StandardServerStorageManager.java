package com.eustacio.seedstartermanager.web.storageManager;

import com.eustacio.seedstartermanager.util.PropertiesUtils;
import com.eustacio.seedstartermanager.web.exception.UnsupportedFileTypeException;
import com.sun.istack.internal.NotNull;
import com.sun.istack.internal.Nullable;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
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
        if (!file.isEmpty()) {
            String originalFilename = file.getOriginalFilename();

            if (isMultipartFileAllowed(file)) {
                String fileExtension = StringUtils.getFilenameExtension(originalFilename);

                // Uses the 'newFileName' parameter if it has some text,otherwise try use the originalFilename,
                // if none of them have text, generates a new one by using the 'generateFilename' method.
                String filename = StringUtils.hasText(newFileName) ? newFileName :
                        StringUtils.hasText(originalFilename) ? originalFilename : generateFilename();

                String sanitizedFilename = sanitizeFileName(filename) + "." + fileExtension;
                String uploadLocation = getUploadLocation(fileExtension);
                File endFile = new File(uploadLocation, sanitizedFilename);

                try {
                    file.transferTo(endFile);
                    return endFile;
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            } else {
                throw new UnsupportedFileTypeException(String.format("The file '%s' does not have an allowed extension", originalFilename));
            }
        }

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

    protected String generateFilename() {
        return String.valueOf(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));
    }

    @Nullable
    protected String getUploadLocation(String fileExtension) {
        return getAllAllowedFileExtensions().get(fileExtension);
    }

    protected boolean isMultipartFileAllowed(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = StringUtils.getFilenameExtension(originalFilename);

        // The file is not allowed if it does not have an extension or if the extension is not allowed
        return fileExtension != null && getAllAllowedFileExtensions().containsKey(fileExtension);
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
