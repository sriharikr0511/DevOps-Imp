pipeline {
    agent any
    
    environment {
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = credentials('sonarqube-token')
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Nikhiill03/taskmanager-devops.git'
                echo 'Repository cloned successfully'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Building backend..."
                        npm install
                        npm run build 2>/dev/null || echo "No build script defined for backend"
                    '''
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Building frontend..."
                        npm install
                        npm run build
                    '''
                }
            }
        }
        
        stage('SonarQube Scan - Backend') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=taskmanager-backend \
                              -Dsonar.projectName="TaskManager Backend" \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=node_modules/**,*.json \
                              -Dsonar.host.url=${SONARQUBE_URL} \
                              -Dsonar.login=${SONAR_AUTH_TOKEN}
                        '''
                    }
                }
            }
        }
        
        stage('SonarQube Scan - Frontend') {
            steps {
                dir('frontend') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=taskmanager-frontend \
                              -Dsonar.projectName="TaskManager Frontend" \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/**,*.json,*.config.js \
                              -Dsonar.host.url=${SONARQUBE_URL} \
                              -Dsonar.login=${SONAR_AUTH_TOKEN}
                        '''
                    }
                }
            }
        }
        
        stage('Docker Build & Compose Test') {
            steps {
                sh '''
                    echo "Testing Docker Compose setup..."
                    docker compose build --no-cache
                    echo "Docker images built successfully"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo '✓ Build successful! Check SonarQube at http://localhost:9000'
        }
        failure {
            echo '✗ Build failed. Check logs above.'
        }
    }
}
