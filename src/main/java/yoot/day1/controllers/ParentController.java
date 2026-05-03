package yoot.day1.controllers;

import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yoot.day1.common.ApiResponse;
import yoot.day1.domain.entity.Parents;
import yoot.day1.service.ParentsService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentsService parentsService;

    @GetMapping
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
