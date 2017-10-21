package com.eustacio.seedstartermanager.config.web;

import com.eustacio.seedstartermanager.config.RootApplicationContext;
import com.eustacio.seedstartermanager.util.PropertiesUtils;

import org.springframework.lang.Nullable;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import java.util.Properties;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletRegistration;

/**
 * @author Wallison Freitas
 */
public class WebApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Nullable
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{RootApplicationContext.class};
    }

    @Nullable
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{WebApplicationContext.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/api/*"};
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        registration.setMultipartConfig(this.getMultipartConfigElement());
    }

    private MultipartConfigElement getMultipartConfigElement() {
        Properties applicationProperties = PropertiesUtils.getApplicationProperties();

        final String location = applicationProperties.getProperty("server.upload.location");
        final long maxFileSize = Long.parseLong(applicationProperties.getProperty("server.upload.file.size.max"));
        final long maxRequestSize = Long.parseLong(applicationProperties.getProperty("server.upload.request.size.max"));
        final int fileSizeThreshold = Integer.parseInt(applicationProperties.getProperty("server.upload.file.threshold.max"));

        return new MultipartConfigElement(location, maxFileSize, maxRequestSize, fileSizeThreshold);
    }

}
