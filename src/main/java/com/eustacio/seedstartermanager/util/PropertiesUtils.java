package com.eustacio.seedstartermanager.util;

import com.sun.istack.internal.NotNull;

import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.util.Properties;

/**
 * @author Wallison S. Freitas
 */
public abstract class PropertiesUtils {

    private static Properties applicationProperties;

    @NotNull
    public static Properties getApplicationProperties() {
        if (applicationProperties == null) {
            applicationProperties = getPropertiesFromFile("application.properties");
            if (applicationProperties == null || applicationProperties.isEmpty()) {
                throw new IllegalStateException("Cannot find the 'application.properties' file");
            }
        }

        return applicationProperties;
    }

    private static Properties getPropertiesFromFile(String fileName) {
        try {
            return PropertiesLoaderUtils.loadAllProperties(fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

}
