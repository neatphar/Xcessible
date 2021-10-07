pipeline {
    agent {label "webserver"}
    stages {

        stage('Preparation') {
            steps {
                sh "test -d ./Xcessible" // Jenkins git clones the repo by default..
            }
        }

        stage('Build Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "docker build . -f Dockerfile -t ahmedshawky21/mean-stack-app_webserver_1:latest"
                }
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh """
                    docker login -u ${USERNAME}  -p ${PASSWORD}
                    docker push ahmedshawky21/mean-stack-app_webserver_1:latest
                    """
                }
            }
        }   

        stage('Depoly') {
            steps {
                sh "docker-compose up --build"
                }
        }   

    }
    
    post {
        always {
            cleanWs()
        }
    } 
}