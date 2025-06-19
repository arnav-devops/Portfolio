export const skills: Record<string, string> = {
  aws: 'AWS: Certified SysOps Administrator, expertise in EC2, S3, Lambda, CloudFormation',
  docker: 'Docker: Containerized 100+ microservices, optimized images for 50% size reduction',
  kubernetes: 'Kubernetes: Managed clusters with 94.99% uptime, implemented auto-scaling',
  terraform: 'Terraform: Provisioned 50+ AWS resources, reduced infra setup time by 70%',
  jenkins: 'Jenkins: Built 20+ CI/CD pipelines, cut deployment time by 40%',
  ansible: 'Ansible: Automated server configs for 100+ nodes, improved consistency',
};

export const manPages: Record<string, string> = {
  deploy: `DEPLOY(1)                 User Commands                 DEPLOY(1)

NAME
       deploy - Simulate CI/CD pipeline for a project

SYNOPSIS
       deploy [project]

DESCRIPTION
       Runs a simulated CI/CD pipeline for projects like oasis,
       biller_gine, zix_forwarding, or infinitytyres.

EXAMPLES
       deploy oasis
              Deploys the Oasis healthcare app pipeline.`,
  'apt-update': `APT-UPDATE(1)             User Commands             APT-UPDATE(1)

NAME
       apt-update - Simulate updating package lists

SYNOPSIS
       apt-update
       sudo apt update

DESCRIPTION
       Mimics Ubuntu's apt update, fetching package lists.`,
  'sudo su': `SUDO SU(1)                User Commands                SUDO SU(1)

NAME
       sudo su - Switch to root user

SYNOPSIS
       sudo su
       su

DESCRIPTION
       Changes the prompt to root mode. Use 'exit' to return.`,
  top: `TOP(1)                    User Commands                    TOP(1)

NAME
       top - Display DevOps stats

SYNOPSIS
       top

DESCRIPTION
       Shows dynamic stats like projects and uptime. Exit with 'q'.`,
  'git log': `GIT LOG(1)                User Commands                GIT LOG(1)

NAME
       git log - Show project timeline

SYNOPSIS
       git log [--oneline]

DESCRIPTION
       Displays a commit history of projects.`,
  curl: `CURL(1)                   User Commands                   CURL(1)

NAME
       curl - Fetch social media profiles

SYNOPSIS
       curl [linkedin|github]

DESCRIPTION
       Retrieves links to LinkedIn or GitHub profiles.`,
  theme: `THEME(1)                  User Commands                  THEME(1)

NAME
       theme - Switch terminal theme

SYNOPSIS
       theme [dark|light]

DESCRIPTION
       Toggles between dark and light themes.`,
  day: `DAY(1)                    User Commands                    DAY(1)

NAME
       day - Switch to day mode (light theme)

SYNOPSIS
       day

DESCRIPTION
       Activates day mode with light background and dark text.`,
  night: `NIGHT(1)                  User Commands                  NIGHT(1)

NAME
       night - Switch to night mode (dark theme)

SYNOPSIS
       night

DESCRIPTION
       Activates night mode with dark background and green text.`,
  certifications: `CERTIFICATIONS(1)         User Commands         CERTIFICATIONS(1)

NAME
       certifications - Display professional certifications

SYNOPSIS
       certifications

DESCRIPTION
       Shows a list of professional certifications with details.`,
};