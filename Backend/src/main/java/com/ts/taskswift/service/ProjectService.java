package com.ts.taskswift.service;

import com.ts.taskswift.exception.ResourceNotFoundException;
import com.ts.taskswift.model.Project;
import com.ts.taskswift.model.ProjectRequest;
import com.ts.taskswift.model.User;
import com.ts.taskswift.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserDetailsServiceImpl userDetailsService;

    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project with ID " + projectId + " does not exist!"));
    }

    public Project addProject(ProjectRequest projectRequest) {
        Project projectToAdd = projectRequest.getProject();
        List<Long> assignedUserIdList = projectRequest.getAssignedUserIdList();
        Set<User> listOfUsers = userDetailsService.loadUsersById(assignedUserIdList);

        for (User user : listOfUsers) {
            projectToAdd.getAssignedUsers().add(user);
        }

        return projectRepository.save(projectToAdd);
    }

    public Project updateProject(Long projectId, Project updatedProject) {
        return projectRepository
                .findById(projectId)
                .map(
                        selectedProject -> {
                            if (updatedProject.getProjectName() != null)
                                selectedProject.setProjectName(updatedProject.getProjectName());

                            if (updatedProject.getProjectDescription() != null)
                                selectedProject.setProjectDescription(updatedProject.getProjectDescription());

                            if (updatedProject.getProjectTimelineStartDate() != null)
                                selectedProject.setProjectTimelineStartDate(updatedProject.getProjectTimelineStartDate());

                            if (updatedProject.getProjectTimelineEndDate() != null)
                                selectedProject.setProjectTimelineEndDate(updatedProject.getProjectTimelineEndDate());

                            if (updatedProject.getAssignedUsers() != null)
                                selectedProject.setAssignedUsers(updatedProject.getAssignedUsers());

                            return projectRepository.save(selectedProject);
                        }
                        ).orElseThrow(() -> new ResourceNotFoundException(
                                "Project with ID " + projectId + " not found. Cannot update non-existent project!"
                        )
                );
    }

    public void deleteProject(Long projectId) {
        if (projectRepository.findById(projectId).isEmpty()) {
            throw new ResourceNotFoundException("Project with ID " + projectId + " does not exist!");
        } else {
            projectRepository.deleteById(projectId);
        }
    }
}
