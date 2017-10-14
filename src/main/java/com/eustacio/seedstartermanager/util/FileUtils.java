package com.eustacio.seedstartermanager.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * @author Wallison.
 */
public abstract class FileUtils {

    public static Properties getPropertiesFromFile(String fileName) {
        Properties properties = new Properties();

        try (InputStream inputStream = FileUtils.class.getClassLoader().getResourceAsStream(fileName)) {
            properties.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return properties;
    }

}
