package com.ts.taskswift.repository;

import com.ts.taskswift.model.entities.Project;
import com.ts.taskswift.model.entities.Task;
import com.ts.taskswift.model.entities.Token;
import com.ts.taskswift.model.entities.User;
import com.ts.taskswift.model.enums.Priority;
import com.ts.taskswift.model.enums.Role;
import com.ts.taskswift.model.enums.Status;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class TaskRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @AfterEach
    void tearDown() {
        taskRepository.deleteAll();
        projectRepository.deleteAll();
        tokenRepository.deleteAll();
    }

    /**
     * Test to verify that the TaskRepository successfully finds tasks by project ID.
     *
     * @Setup: Create a user, generate a JWT token for the user, and save it to the TokenRepository. Create a project and save it to the ProjectRepository. Create a task assigned to the project and save it to the TaskRepository.
     * @Execution: Call the findByProjectId method of the TaskRepository with the ID of the project.
     * @Assertion: Verify that the method returns a list containing the task assigned to the specified project.
     */
    @Test
    void itShouldFindByProjectId() {
        User user = new User();
        user.setUsername("Jack");
        user.setPassword("password");
        user.setEmail("jack@gmail.com");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        String SECRET_KEY = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        tokenRepository.save(token);

        Project project = new Project();
        project.setProjectName("Project");
        project.setProjectDescription("Project description");

        Set<User> assignedUsers = new HashSet<>();
        assignedUsers.add(user);
        project.setAssignedUsers(assignedUsers);

        project.setTasks(new HashSet<>());
        project.setInvitations(new HashSet<>());

        project = projectRepository.save(project);

        Task task = new Task();
        task.setTaskName("Task");
        task.setTaskDescription("Task description");
        task.setTaskStatus(Status.TO_DO);
        task.setTaskPriority(Priority.LOW);
        task.setAssignedUsers(assignedUsers);
        task.setTaskTimelineStartDateTime("2024-04-24");
        task.setTaskTimelineEndDateTime("2024-04-25");
        task.setProject(project);

        task = taskRepository.save(task);

        List<Task> tasksFromDatabase = taskRepository.findByProjectId(project.getProjectId());
        boolean taskExistsById = (tasksFromDatabase.size() == 1) && (tasksFromDatabase.get(0) == task);

        assertThat(taskExistsById).isTrue();
    }

    /**
     * Test to verify that the TaskRepository does not find tasks by project ID when the task has no associated project.
     *
     * @Setup: Create a user, generate a JWT token for the user, and save it to the TokenRepository. Create a project and save it to the ProjectRepository. Create a task with no assigned project and save it to the TaskRepository.
     * @Execution: Call the findByProjectId method of the TaskRepository with the project ID.
     * @Assertion: Verify that the method returns an empty list, indicating that no tasks are associated with the specified project ID.
     */
    @Test
    void itShouldNotFindByProjectId() {
        User user = new User();
        user.setUsername("Jack");
        user.setPassword("password");
        user.setEmail("jack@gmail.com");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        String SECRET_KEY = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        tokenRepository.save(token);

        Project project = new Project();
        project.setProjectName("Project");
        project.setProjectDescription("Project description");

        Set<User> assignedUsers = new HashSet<>();
        assignedUsers.add(user);
        project.setAssignedUsers(assignedUsers);

        project.setTasks(new HashSet<>());
        project.setInvitations(new HashSet<>());

        project = projectRepository.save(project);

        Task task = new Task();
        task.setTaskName("Task");
        task.setTaskDescription("Task description");
        task.setTaskStatus(Status.TO_DO);
        task.setTaskPriority(Priority.LOW);
        task.setAssignedUsers(assignedUsers);
        task.setTaskTimelineStartDateTime("2024-04-24");
        task.setTaskTimelineEndDateTime("2024-04-25");
        task.setProject(null);

        task = taskRepository.save(task);

        List<Task> tasksFromDatabase = taskRepository.findByProjectId(project.getProjectId());
        boolean taskExistsById = (tasksFromDatabase.size() == 1) && (tasksFromDatabase.get(0) == task);

        assertThat(taskExistsById).isFalse();
    }

    /**
     * Test to verify that the TaskRepository does not find tasks by project ID when the project is not assigned to any tasks.
     *
     * @Setup: Create a user, generate a JWT token for the user, and save it to the TokenRepository. Create a project and save it to the ProjectRepository. Create a task with no assigned project and save it to the TaskRepository.
     * @Execution: Call the findByProjectId method of the TaskRepository with the ID of the project.
     * @Assertion: Verify that the method returns an empty list, indicating that no tasks are associated with the specified project.
     */
    @Test
    void itShouldFindByTaskIdAndProjectId() {
        User user = new User();
        user.setUsername("Jack");
        user.setPassword("password");
        user.setEmail("jack@gmail.com");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        String SECRET_KEY = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        tokenRepository.save(token);

        Project project = new Project();
        project.setProjectName("Project");
        project.setProjectDescription("Project description");

        Set<User> assignedUsers = new HashSet<>();
        assignedUsers.add(user);
        project.setAssignedUsers(assignedUsers);

        project.setTasks(new HashSet<>());
        project.setInvitations(new HashSet<>());

        project = projectRepository.save(project);

        Task task = new Task();
        task.setTaskName("Task");
        task.setTaskDescription("Task description");
        task.setTaskStatus(Status.TO_DO);
        task.setTaskPriority(Priority.LOW);
        task.setAssignedUsers(assignedUsers);
        task.setTaskTimelineStartDateTime("2024-04-24");
        task.setTaskTimelineEndDateTime("2024-04-25");
        task.setProject(project);

        task = taskRepository.save(task);

        Task taskFromDatabase = taskRepository.findByTaskIdAndProjectId(task.getTaskId(), project.getProjectId());
        boolean taskExistsByProjectIdAndTaskId = (taskFromDatabase == task);

        assertThat(taskExistsByProjectIdAndTaskId).isTrue();
    }

    /**
     * Test to verify that the TaskRepository does not find tasks by task ID and project ID when the task has no associated project.
     *
     * @Setup: Create a user, generate a JWT token for the user, and save it to the TokenRepository. Create a project and save it to the ProjectRepository. Create a task with no assigned project and save it to the TaskRepository.
     * @Execution: Call the findByTaskIdAndProjectId method of the TaskRepository with the task ID and project ID.
     * @Assertion: Verify that the method returns null, indicating that no task is associated with the specified task ID and project ID.
     */
    @Test
    void itShouldNotFindByTaskIdAndProjectId() {
        User user = new User();
        user.setUsername("Jack");
        user.setPassword("password");
        user.setEmail("jack@gmail.com");
        user.setRole(Role.USER);
        user.setAssignedProjects(new HashSet<>());
        user.setAssignedTasks(new HashSet<>());
        user = userRepository.save(user);

        String SECRET_KEY = "157618267b300724941f0d8b521afb6b90bec5503b5427e6fe603f01152a39d7";
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        String jwt = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();

        Token token = new Token();
        token.setUser(user);
        token.setToken(jwt);
        tokenRepository.save(token);

        Project project = new Project();
        project.setProjectName("Project");
        project.setProjectDescription("Project description");

        Set<User> assignedUsers = new HashSet<>();
        assignedUsers.add(user);
        project.setAssignedUsers(assignedUsers);

        project.setTasks(new HashSet<>());
        project.setInvitations(new HashSet<>());

        project = projectRepository.save(project);

        Task task = new Task();
        task.setTaskName("Task");
        task.setTaskDescription("Task description");
        task.setTaskStatus(Status.TO_DO);
        task.setTaskPriority(Priority.LOW);
        task.setAssignedUsers(assignedUsers);
        task.setTaskTimelineStartDateTime("2024-04-24");
        task.setTaskTimelineEndDateTime("2024-04-25");
        task.setProject(null);

        task = taskRepository.save(task);

        Task taskFromDatabase = taskRepository.findByTaskIdAndProjectId(task.getTaskId(), project.getProjectId());
        boolean taskExistsByProjectIdAndTaskId = (taskFromDatabase == task);

        assertThat(taskExistsByProjectIdAndTaskId).isFalse();
    }
}
