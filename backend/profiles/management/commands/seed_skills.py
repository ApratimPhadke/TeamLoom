"""
Management command to seed initial skills data.
"""
from django.core.management.base import BaseCommand
from profiles.models import Skill


class Command(BaseCommand):
    help = 'Seed the database with initial skills taxonomy'
    
    SKILLS_DATA = [
        # Programming Languages
        ('Python', 'programming', 'General-purpose programming language'),
        ('JavaScript', 'programming', 'Web and server-side programming'),
        ('TypeScript', 'programming', 'Typed JavaScript'),
        ('Java', 'programming', 'Enterprise programming language'),
        ('C++', 'programming', 'Systems programming language'),
        ('C', 'programming', 'Low-level systems programming'),
        ('Go', 'programming', 'Google\'s systems programming language'),
        ('Rust', 'programming', 'Memory-safe systems programming'),
        ('Kotlin', 'programming', 'Modern JVM language'),
        ('Swift', 'programming', 'Apple\'s programming language'),
        
        # Hardware & Embedded
        ('Verilog', 'hardware', 'Hardware description language'),
        ('VHDL', 'hardware', 'Hardware description language'),
        ('SPICE', 'hardware', 'Circuit simulation'),
        ('Arduino', 'hardware', 'Microcontroller platform'),
        ('Raspberry Pi', 'hardware', 'Single-board computer'),
        ('FPGA', 'hardware', 'Field-programmable gate arrays'),
        ('PCB Design', 'hardware', 'Printed circuit board design'),
        ('Embedded C', 'hardware', 'Embedded systems programming'),
        
        # Web Development
        ('React', 'web', 'Frontend JavaScript library'),
        ('Vue.js', 'web', 'Progressive JavaScript framework'),
        ('Angular', 'web', 'Google\'s web framework'),
        ('Next.js', 'web', 'React framework for production'),
        ('Node.js', 'web', 'JavaScript runtime'),
        ('Django', 'web', 'Python web framework'),
        ('Flask', 'web', 'Lightweight Python framework'),
        ('FastAPI', 'web', 'Modern Python API framework'),
        ('Express.js', 'web', 'Node.js web framework'),
        ('HTML/CSS', 'web', 'Web markup and styling'),
        ('Tailwind CSS', 'web', 'Utility-first CSS framework'),
        
        # Mobile Development
        ('React Native', 'mobile', 'Cross-platform mobile framework'),
        ('Flutter', 'mobile', 'Google\'s UI toolkit'),
        ('iOS Development', 'mobile', 'Apple mobile development'),
        ('Android Development', 'mobile', 'Google mobile development'),
        
        # Data Science & ML
        ('Machine Learning', 'data', 'ML algorithms and techniques'),
        ('Deep Learning', 'data', 'Neural networks'),
        ('TensorFlow', 'data', 'Google\'s ML framework'),
        ('PyTorch', 'data', 'Facebook\'s ML framework'),
        ('Data Analysis', 'data', 'Data exploration and analysis'),
        ('Pandas', 'data', 'Python data manipulation'),
        ('NumPy', 'data', 'Numerical computing'),
        ('Computer Vision', 'data', 'Image processing and analysis'),
        ('NLP', 'data', 'Natural language processing'),
        ('Data Visualization', 'data', 'Charts and visual analytics'),
        
        # Databases
        ('PostgreSQL', 'database', 'Relational database'),
        ('MySQL', 'database', 'Relational database'),
        ('MongoDB', 'database', 'Document database'),
        ('Redis', 'database', 'In-memory data store'),
        ('SQLite', 'database', 'Embedded database'),
        ('Firebase', 'database', 'Google\'s app platform'),
        
        # DevOps & Cloud
        ('Docker', 'devops', 'Containerization platform'),
        ('Kubernetes', 'devops', 'Container orchestration'),
        ('AWS', 'devops', 'Amazon Web Services'),
        ('GCP', 'devops', 'Google Cloud Platform'),
        ('Azure', 'devops', 'Microsoft cloud'),
        ('CI/CD', 'devops', 'Continuous integration/deployment'),
        ('Linux', 'devops', 'Operating system'),
        ('Git', 'devops', 'Version control'),
        
        # Design
        ('UI Design', 'design', 'User interface design'),
        ('UX Design', 'design', 'User experience design'),
        ('Figma', 'design', 'Design tool'),
        ('Adobe XD', 'design', 'Design tool'),
        ('Graphic Design', 'design', 'Visual design'),
        ('3D Modeling', 'design', '3D graphics'),
        ('CAD', 'design', 'Computer-aided design'),
        
        # Tools & Frameworks
        ('REST APIs', 'tools', 'API design'),
        ('GraphQL', 'tools', 'Query language for APIs'),
        ('WebSockets', 'tools', 'Real-time communication'),
        ('Testing', 'tools', 'Software testing'),
        ('Agile/Scrum', 'tools', 'Project methodology'),
        
        # Soft Skills
        ('Project Management', 'soft', 'Managing projects'),
        ('Leadership', 'soft', 'Team leadership'),
        ('Communication', 'soft', 'Effective communication'),
        ('Problem Solving', 'soft', 'Analytical thinking'),
        ('Technical Writing', 'soft', 'Documentation'),
    ]
    
    def handle(self, *args, **options):
        created_count = 0
        
        for name, category, description in self.SKILLS_DATA:
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={
                    'category': category,
                    'description': description,
                    'is_active': True
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'  Created: {name}')
        
        self.stdout.write(
            self.style.SUCCESS(f'\nSeeded {created_count} new skills (total: {Skill.objects.count()})')
        )
