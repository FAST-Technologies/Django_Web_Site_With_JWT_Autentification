from django.test import TestCase
from book.models import Project, Task
from book.views import dashboard_view
from django.test.client import RequestFactory

class ProjectTaskTests(TestCase):
    def setUp(self):
        self.project1 = Project.objects.create(
            name="ПРОЕКТ 1",
            description="Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
        )
        self.project2 = Project.objects.create(
            name="ПРОЕКТ 2",
            description="Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
        )
        self.project3 = Project.objects.create(
            name="ПРОЕКТ 3",
            description="Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
        )

        self.task1 = Task.objects.create(
            project=self.project1,
            name="Перечень данных сайта для вывода заказов",
            description="Перечень данных сайта для вывода заказов"
        )
        self.task2 = Task.objects.create(
            project=self.project2,
            name="Донести бота в Telegram для упрощения взаимодействия",
            description="Донести бота в Telegram для упрощения взаимодействия"
        )
        self.task3 = Task.objects.create(
            project=self.project3,
            name="Отстроить микросервис на складе",
            description="Отстроить микросервис на складе"
        )

    def test_projects_exist(self):
        projects = Project.objects.all()
        print("Projects:", list(projects))  # Debug output
        self.assertEqual(projects.count(), 3)  # Check that 3 projects were created
        self.assertEqual(projects[0].name, "ПРОЕКТ 1")
        self.assertEqual(projects[1].name, "ПРОЕКТ 2")
        self.assertEqual(projects[2].name, "ПРОЕКТ 3")

    def test_tasks_exist(self):
        # Test that tasks are created and can be retrieved
        tasks = Task.objects.all()
        print("Tasks:", list(tasks))  # Debug output
        self.assertEqual(tasks.count(), 3)  # Check that 3 tasks were created
        self.assertEqual(tasks[0].name, "Перечень данных сайта для вывода заказов")
        self.assertEqual(tasks[1].name, "Донести бота в Telegram для упрощения взаимодействия")
        self.assertEqual(tasks[2].name, "Отстроить микросервис на складе")

    def test_task_project_relationship(self):
        # Test the relationship between tasks and projects
        task = Task.objects.get(name="Перечень данных сайта для вывода заказов")
        self.assertEqual(task.project.name, "ПРОЕКТ 1")

    def test_dashboard_view(self):
        # Test the dashboard_view
        # Create a request using RequestFactory
        factory = RequestFactory()
        request = factory.get('/dashboard/')

        # Call the view
        response = dashboard_view(request)

        # Check the response status code
        self.assertEqual(response.status_code, 200)

        # Check the context
        projects = response.context_data['projects']
        tasks = response.context_data['tasks']

        print("Dashboard view projects:", list(projects))
        print("Dashboard view tasks:", list(tasks))

        # Verify the number of projects and tasks in the context
        self.assertEqual(len(projects), 3)
        self.assertEqual(len(tasks), 3)

        # Verify the project names
        project_names = [project.name for project in projects]
        self.assertIn("ПРОЕКТ 1", project_names)
        self.assertIn("ПРОЕКТ 2", project_names)
        self.assertIn("ПРОЕКТ 3", project_names)

        # Verify the task names
        task_names = [task.name for task in tasks]
        self.assertIn("Перечень данных сайта для вывода заказов", task_names)
        self.assertIn("Донести бота в Telegram для упрощения взаимодействия", task_names)
        self.assertIn("Отстроить микросервис на складе", task_names)