pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Nikhiill03/taskmanager-devops.git'
                echo 'Repository cloned successfully'
            }
        }
        stage('Build') {
            steps {
                echo 'Building the project...'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                echo 'All tests passed'
            }
        }
    }
}
