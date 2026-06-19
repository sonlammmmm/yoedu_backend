package yoot.yoedu_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import yoot.yoedu_backend.common.ApiResponse;
import yoot.yoedu_backend.domain.entity.Parents;
import yoot.yoedu_backend.service.ParentsService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/parents")
@RequiredArgsConstructor
@Tag(name = "Parent", description = "Parent management endpoints")
@SecurityRequirement(name = "jwt")
public class ParentController {

    private final ParentsService parentsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Parents>>> getParents() {
        return ResponseEntity.ok(ApiResponse.success("Success", parentsService.findAll()));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<Parents>> getParentById(@PathVariable("id") Long id) {
        Optional<Parents> parents = parentsService.findById(id);

        if (parents.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Success", parents.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Parents>> create(@RequestBody Parents parents) {
        return ResponseEntity.ok(ApiResponse.success("Success", parentsService.save(parents)));
    }

    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<Parents>> update(@PathVariable("id") Long id, @RequestBody Parents parents) {
        Optional<Parents> existing = parentsService.findById(id);

        if (existing.isPresent()) {
            parents.setId(id);
            return ResponseEntity.ok(ApiResponse.success("Success", parentsService.save(parents)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Parents>> delete(@PathVariable("id") Long id) {
        parentsService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
