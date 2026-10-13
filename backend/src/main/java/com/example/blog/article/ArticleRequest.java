package com.example.blog.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ArticleRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank String content,
        @NotNull LocalDate publicationDate) {
}
