package com.example.blog.article;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleRepository articles;

    public ArticleController(ArticleRepository articles) {
        this.articles = articles;
    }

    @GetMapping
    public List<Article> list() {
        return articles.findAllByOrderByPublicationDateDesc();
    }

    @GetMapping("/{id}")
    public Article get(@PathVariable Long id) {
        return findArticle(id);
    }

    @PostMapping
    public ResponseEntity<Article> create(@Valid @RequestBody ArticleRequest request) {
        Article article = articles.save(new Article(
                request.title().trim(), request.content().trim(), request.publicationDate()));
        return ResponseEntity.created(URI.create("/api/articles/" + article.getId())).body(article);
    }

    @PutMapping("/{id}")
    public Article update(@PathVariable Long id, @Valid @RequestBody ArticleRequest request) {
        Article article = findArticle(id);
        article.setTitle(request.title().trim());
        article.setContent(request.content().trim());
        article.setPublicationDate(request.publicationDate());
        return articles.save(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articles.delete(findArticle(id));
        return ResponseEntity.noContent().build();
    }

    private Article findArticle(Long id) {
        return articles.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Article not found"));
    }
}
