package com.eustacio.seedstartermanager.web.storageManager;

import com.eustacio.seedstartermanager.util.PropertiesUtils;
import com.eustacio.seedstartermanager.web.exception.UnsupportedFileTypeException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Hashtable;
import java.util.Properties;

import mockit.Mock;
import mockit.MockUp;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

/**
 * @author Wallison S. Freitas
 */
class StandardServerStorageManagerTest {

    private static final String USER_DIRECTORY = System.getProperty("user.home");

    private StandardServerStorageManager serverStorageManager;

    @BeforeAll
    static void beforeAll() {
        // Initialized the fake by instantiating it
        new MockPropertiesUtils();
    }

    @BeforeEach
    void beforeEachTest() {
        this.serverStorageManager = new StandardServerStorageManager();
    }

    @Test
    @Disabled("Not implemented yet")
    void transferFileToServer() {
        // TODO: Make the test independent of the platform
    }

    @Test
    @DisplayName("transferFileToServer() should return null when the MultipartFile is empty")
    void transferFileToServer_ShouldReturnNull_WhenTheMultipartFileIsEmpty() {
        MockMultipartFile mockMultipartFile = new MockMultipartFile("empty file", new byte[]{});

        File savedFile = serverStorageManager.transferFileToServer(mockMultipartFile, anyString());

        assertThat(savedFile).isNull();
    }

    @Test
    @DisplayName("transferFileToServer() should throw exception when the MultipartFile type is not allowed")
    void transferFileToServer_ShouldThrowException_WhenTheMultipartFileTypeIsNotAllowed() {
        MockMultipartFile mockMultipartFile =
                new MockMultipartFile("not allowed file extension", "me.wtf", "image/jpeg", new byte[]{6, 6, 6});

        assertThatExceptionOfType(UnsupportedFileTypeException.class)
                .isThrownBy(() -> serverStorageManager.transferFileToServer(mockMultipartFile, anyString()));
    }


    @Test
    void getFileAsResource() throws IOException {
        File tempFile = File.createTempFile("test-", null, Paths.get(USER_DIRECTORY).toFile());
        tempFile.deleteOnExit();

        Resource resource = serverStorageManager.getFileAsResource(tempFile.getName());

        assertThat(resource).isNotNull();
        assertThat(resource.exists()).isTrue();
        assertThat(resource.getFile()).isEqualTo(tempFile);
    }

    @Test
    void getFileAsResource_ShouldThrowException_WhenTheFileNotExists() {
        assertThatExceptionOfType(RuntimeException.class)
                .isThrownBy(() -> serverStorageManager.getFileAsResource("some file"));
    }

    @Test
    @DisplayName("getFileAsResource() should throw exception when the filename is null")
    void getFileAsResource_ShouldThrowException_WhenTheFilenameIsNull() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> serverStorageManager.getFileAsResource(null));
    }

    @Test
    @DisplayName("getFileAsResource() should throw exception when the filename is empty or has only whitespace")
    void getFileAsResource_ShouldThrowException_WhenTheFilenameIsEmptyOrHasOnlyWhiteSpace() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> serverStorageManager.getFileAsResource(""));

        assertThatIllegalArgumentException()
                .isThrownBy(() -> serverStorageManager.getFileAsResource("  "));
    }

    @Test
    @DisplayName("sanitizeFileName() should remove any special character from the string")
    void sanitizeFileName_ShouldRemoveAnySpecialCharacterFromTheString() {
        String input = "../somewhere\\123. !@#$%*()+=-;/><}{`~/image";
        String expectedOutput = "somewhere123_image";

        String output = serverStorageManager.sanitizeFileName(input);

        assertThat(output).isEqualTo(expectedOutput);
    }

    @Test
    void generateFilename() {
        String expectedOutput = String.valueOf(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC));

        String output = serverStorageManager.generateFilename();

        assertThat(output).isEqualTo(expectedOutput);
    }

    @Test
    void getUploadLocation() {
        String uploadLocation = serverStorageManager.getUploadLocation("jpg");

        assertThat(uploadLocation).isEqualTo("/narnia");
    }

    @Test
    @DisplayName("isMultipartFileAllowed() should return true when the MultipartFile type is allowed")
    void isMultipartFileAllowed_ShouldReturnTrue_WhenTheMultiPartFileTypeIsAllowed() {
        boolean isMultipartFileAllowed = serverStorageManager
                .isMultipartFileAllowed(new MockMultipartFile("some image", "me.jpg", "image/jpeg", new byte[]{}));

        assertThat(isMultipartFileAllowed).isTrue();
    }

    @Test
    @DisplayName("isMultipartFileAllowed() should return false when the MultipartFile type is not allowed")
    void isMultipartFileAllowed_ShouldReturnFalse_WhenTheMultiPartFileTypeIsNotAllowed() {
        boolean isMultipartFileAllowed = serverStorageManager
                .isMultipartFileAllowed(new MockMultipartFile("some image", "me.wtf", "image/jpeg", new byte[]{}));

        assertThat(isMultipartFileAllowed).isFalse();
    }

    @Test
    void getAllAllowedFileExtensions() {
        Hashtable<String, String> expectedFileExtensions = new Hashtable<>();
        expectedFileExtensions.put("jpg", "/narnia");
        expectedFileExtensions.put("png", "/narnia");
        expectedFileExtensions.put("tmp", USER_DIRECTORY);

        Hashtable<String, String> allAllowedFileExtensions = serverStorageManager.getAllAllowedFileExtensions();

        assertThat(allAllowedFileExtensions).isEqualTo(expectedFileExtensions);
    }

    @Test
    void splitStringOnAnySpecialCharacter() {
        String input = "this method-should; split;this, string,in+each:special  character";
        String[] expectedOutput = new String[]{"this", "method", "should", "split", "this", "string", "in", "each", "special", "character"};

        String[] output = serverStorageManager.splitStringOnAnySpecialCharacter(input);

        assertThat(output).containsOnly(expectedOutput);
        assertThat(output).hasSize(expectedOutput.length);
    }


    static class MockPropertiesUtils extends MockUp<PropertiesUtils> {

        @Mock
        static Properties getApplicationProperties() {
            Properties fakeApplicationProperties = new Properties();
            fakeApplicationProperties.setProperty("server.upload.allowed_extensions.images", "jpg, png");
            fakeApplicationProperties.setProperty("server.upload.allowed_extensions.temp_file", "tmp");
            fakeApplicationProperties.setProperty("server.upload.location.images", "/narnia");
            fakeApplicationProperties.setProperty("server.upload.location.temp_file", USER_DIRECTORY);
            return fakeApplicationProperties;
        }
    }

}

