from django.core.management.base import BaseCommand
from book.models import Project, Task, TeamMember

class Command(BaseCommand):
    help = 'Seeds the database with initial projects, tasks, and team members'

    def add_arguments(self, parser):
        parser.add_argument('--flush', action='store_true', help='Flush the database before seeding')

    def handle(self, *args, **options):
        if options['flush']:
            self.stdout.write(self.style.WARNING("Flushing database..."))
            Project.objects.all().delete()
            Task.objects.all().delete()
            TeamMember.objects.all().delete()

        projects_data = [
            {
                "name": "ПРОЕКТ 1",
                "description": "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
            },
            {
                "name": "ПРОЕКТ 2",
                "description": "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
            },
            {
                "name": "ПРОЕКТ 3",
                "description": "Здесь будет некоторое описание проекта, для понимания, как он будет использоваться"
            },
        ]

        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                name=project_data["name"],
                defaults={"description": project_data["description"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created project: {project.name}"))

        tasks_data = [
            {
                "project": Project.objects.get(name="ПРОЕКТ 1"),
                "name": "Перечень данных сайта для вывода заказов",
                "description": "Перечень данных сайта для вывода заказов"
            },
            {
                "project": Project.objects.get(name="ПРОЕКТ 2"),
                "name": "Донести бота в Telegram для упрощения взаимодействия",
                "description": "Донести бота в Telegram для упрощения взаимодействия"
            },
            {
                "project": Project.objects.get(name="ПРОЕКТ 3"),
                "name": "Отстроить микросервис на складе",
                "description": "Отстроить микросервис на складе"
            },
            {
                "project": Project.objects.get(name="ПРОЕКТ 3"),
                "name": "Придумать способ передачи JWT-токенов на сервер",
                "description": "Придумать способ передачи JWT-токенов на сервер"
            },
            {
                "project": Project.objects.get(name="ПРОЕКТ 3"),
                "name": "Придумать ещё проект",
                "description": "Придумать ещё проект"
            },
        ]

        for task_data in tasks_data:
            task, created = Task.objects.get_or_create(
                name=task_data["name"],
                project=task_data["project"],
                defaults={"description": task_data["description"]}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created task: {task.name}"))

        team_members_data = [
            {
                "name": "Ильдар Нигаматов",
                "description": "Главный разработчик и тимлид проекта, Senior GO-разработчик, CTO, разработчик WMS",
                "image": "team_images/no_member.jpg"
            },
            {
                "name": "Юлия Гриневич",
                "description": "Middle GO-разработчик и CMO проекта, разработчик WMS",
                "image": "team_images/YOULIA.jpg"
            },
            {
                "name": "Артём Федченко",
                "description": "Главный Middle-frontend разработчик, React/NodeJS разработчик WebApp сервиса",
                "image": "team_images/Artem.jpg"
            },
            {
                "name": "Владимир Ямщиков",
                "description": "Django-frontend-разработчик, разработчик Project Management Tool",
                "image": "team_images/Vladimir.jpg"
            },
            {
                "name": "Иван Азаров",
                "description": "Junior GO-разработчик, разработчик Authentification Service",
                "image": "team_images/Ivan.jpg"
            },
            {
                "name": "Абдумалик Абдукаримов",
                "description": "Middle Python-разработчик",
                "image": "team_images/Malik.jpg"
            },
            {
                "name": "Хайруллохон Комилов",
                "description": "Middle Python-разработчик, разработчик Telegram-бота проекта",
                "image": "team_images/Khon.jpg"
            },
            {
                "name": "Заквиддин Таджибаев",
                "description": "Junior GO-разработчик, разработчик Kafka",
                "image": "team_images/Zavik.jpg"
            },
        ]

        for member_data in team_members_data:
            TeamMember.objects.filter(name=member_data["name"]).delete()
            member = TeamMember.objects.create(
                name=member_data["name"],
                description=member_data["description"],
                image=member_data["image"]
            )
            self.stdout.write(self.style.SUCCESS(f"Updated team member: {member.name}"))

        self.stdout.write(self.style.SUCCESS("Successfully seeded the database"))