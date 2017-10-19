package com.eustacio.seedstartermanager.web.storageManager;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

/**
 * @author Wallison S. Freitas
 */
@Component
public class StandardServerStorageManager implements ServerStorageManager {

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

}
