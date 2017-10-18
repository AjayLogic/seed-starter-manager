package com.eustacio.seedstartermanager.web.storageManager;

import org.springframework.stereotype.Component;
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

}
