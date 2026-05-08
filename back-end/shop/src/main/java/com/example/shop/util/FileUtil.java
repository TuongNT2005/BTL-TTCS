    package com.example.shop.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.multipart.MultipartFile;

public class FileUtil {

    public static String getPath(String nameOfFile) {
        String folderName = nameOfFile.split("_")[0];
        Path currentPath = Paths.get(System.getProperty("user.dir"));
        Path parentPath = currentPath.getParent();
        System.out.println(parentPath.toString() + "/uploads/" + folderName + "/" + nameOfFile);
        return parentPath.toString() + "/uploads/" + folderName + "/" + nameOfFile;
    }

    public static void deleteFile(String nameOfFile) {
        Path path = Paths.get(getPath(nameOfFile));
        try {
            Files.delete(path);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public static Boolean isFilePresent(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        return true;
    }

    public static String saveFileToDir(MultipartFile file, String folderName, String nameOfFile) {

        if (!isFilePresent(file)) {
            return "";
        }

        Path currentPath = Paths.get(System.getProperty("user.dir"));
        Path parentPath = currentPath.getParent();
        String uploadDir = parentPath.toString() + "/uploads/" + folderName + "/";

        File dir = new File(uploadDir);

        System.out.println("Absolute path: " + dir.getAbsolutePath());

        if (!dir.exists()) {
            dir.mkdirs();
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || !originalName.contains(".")) {
            throw new RuntimeException("Invalid filename");
        }

        String extension = originalName.substring(originalName.lastIndexOf("."));

        String newFileName = nameOfFile + extension;

        File dest = new File(dir, newFileName);

        try {
            file.transferTo(dest);
        } catch (IllegalStateException | IOException e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return newFileName;
    }

    public static String genFileName(String prefix) {
        return prefix + System.currentTimeMillis();
    }
}