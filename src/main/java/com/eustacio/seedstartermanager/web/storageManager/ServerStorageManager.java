package com.eustacio.seedstartermanager.web.storageManager;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;

/**
 * @author Wallison S. Freitas
 */
public interface ServerStorageManager {

    File transferFileToServer(MultipartFile file, String newFileName);

}
