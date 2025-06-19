import { Project } from '../types/terminal';

export const projects: Record<string, Project> = {
  oasis: {
    name: 'Oasis',
    description: 'HIPAA-compliant healthcare app with CI/CD on AWS',
    metrics: 'Uptime: 94.99%, Deployments: 100+/month',
    tech: 'AWS, Docker, Kubernetes, Jenkins, .NET Core',
    logs: [
      '[INFO] Cloning repository...',
      '[INFO] Building Docker image...',
      '[INFO] Running unit tests... 100% passed',
      '[INFO] Pushing to AWS ECR...',
      '[INFO] Deploying to Kubernetes...',
    ],
    success: '[SUCCESS] Build complete! Uptime: 94.99%, Build time: 45s',
    details: `cat oasis_details.txt
Name: Oasis
Description: HIPAA-compliant healthcare application with automated CI/CD pipelines on AWS
Tech Stack: AWS (EC2, S3, RDS), Docker, Kubernetes, Jenkins, .NET Core
Metrics: Uptime: 94.99%, Deployments: 100+/month
Impact: Enabled secure patient data processing for 50K+ users`
  },
  biller_gine: {
    name: 'Biller Gine',
    description: 'Billing system on Azure DevOps with Docker',
    metrics: 'Deployment Time: -50%, Containers: 20+',
    tech: 'Azure DevOps, Docker, .NET Core, SQL Server',
    logs: [
      '[INFO] Fetching source code...',
      '[INFO] Compiling .NET Core...',
      '[INFO] Running integration tests... 95% passed',
      '[INFO] Building containers...',
      '[INFO] Deploying to Azure...',
    ],
    success: '[SUCCESS] Build complete! Deployment time: 30s',
    details: `cat biller_gine_details.txt
Name: Biller Gine
Description: Billing system with automated deployments on Azure DevOps
Tech Stack: Azure DevOps, Docker, .NET Core, SQL Server
Metrics: Deployment Time: -50%, Containers: 20+
Impact: Streamlined billing for 10K+ transactions daily`
  },
  zix_forwarding: {
    name: 'ZIX Forwarding Live',
    description: 'Freight SaaS with .NET Core and Jenkins',
    metrics: 'Transactions: 10K+/day, Pipeline: 5 stages',
    tech: '.NET Core, Jenkins, AWS, PostgreSQL',
    logs: [
      '[INFO] Triggering Jenkins pipeline...',
      '[INFO] Compiling application...',
      '[INFO] Running load tests...',
      '[INFO] Packaging artifacts...',
      '[INFO] Deploying to production...',
    ],
    success: '[SUCCESS] Build complete! Transactions: 10K+/day',
    details: `cat zix_forwarding_details.txt
Name: ZIX Forwarding Live
Description: Freight SaaS platform with automated CI/CD using Jenkins
Tech Stack: .NET Core, Jenkins, AWS (Lambda, API Gateway), PostgreSQL
Metrics: Transactions: 10K+/day, Pipeline: 5 stages
Impact: Improved logistics processing for 500+ clients`
  },
  infinitytyres: {
    name: 'InfinityTyres',
    description: 'ERP system with .NET 6, Angular, Terraform',
    metrics: 'Modules: 15, Infra Cost: -30%',
    tech: '.NET 6, Angular, Terraform, AWS',
    logs: [
      '[INFO] Initializing Terraform...',
      '[INFO] Building Angular frontend...',
      '[INFO] Running security scans...',
      '[INFO] Applying infrastructure changes...',
      '[INFO] Deploying to AWS...',
    ],
    success: '[SUCCESS] Build complete! Infra cost: -30%',
    details: `cat infinitytyres_details.txt
Name: InfinityTyres
Description: ERP system for tire manufacturing with automated infrastructure
Tech Stack: .NET 6, Angular, Terraform, AWS (ECS, RDS)
Metrics: Modules: 15, Infra Cost: -30%
Impact: Optimized operations for 5K+ daily orders`
  },
};