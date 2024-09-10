def ENV_NAME = ""
def ENV_PORT = 0
def NODE_ENV = "dev"

pipeline {
    agent any

    environment {
    //DOCKERHUB_USERNAME = "mhaydi"
    DOCKERHUB_CREDENTIALS = 'dockertoken' // Use the provided credentials ID here
    DOCKER_IMAGE_NAME = "mhaydi/thetiptop6archiwebback-${ENV_NAME}-nodejsimage"
    }

    stages { 
        stage("Environment Variables") {
            steps {
                script {
                    def branchName = scm.branches[0].name
                    echo "Branch Name: ${branchName}"

                    if (branchName == "*/dev") {
                        ENV_NAME = "dev"
                        ENV_PORT = 5002
                        NODE_ENV = "dev"
                    } else if (branchName == "*/release") {
                        ENV_NAME = "preprod"
                        ENV_PORT = 5001
                    } else {
                        ENV_NAME = 'dev'
                        ENV_PORT = 5000
                        NODE_ENV = "dev"
                    }
                }
            }
        }

        stage("cache") {
            steps {
                script { 
                    sh "rm -rf package-lock.json"
                    sh "rm -rf node_modules"
                }
            }
        }
        
        stage("Build Custom NodeJS image") {
            steps {
                script {
                    sh "docker build -t mhaydi/thetiptop6archiwebback-$ENV_NAME-nodejsimage ."
                }
            }
        }

        stage("Stop NodeJS Container") {
            steps {
                script {
                    sh "docker stop thetiptop6archiwebback-${ENV_NAME} || true"
                    sh "docker rm -f thetiptop6archiwebback-${ENV_NAME} || true"
                }
            }
        }

        stage("Deploy NodeJS Container") {
            steps {
                script {
                    sh "docker run --rm -p ${ENV_PORT}:5000 -e NODE_ENV=${NODE_ENV} --name thetiptop6archiwebback-${ENV_NAME} -d mhaydi/thetiptop6archiwebback-${ENV_NAME}-nodejsimage"
                }
            }
        }

        stage("Push Img to DockerHub") {
            steps {
                script {
                 withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh "docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD"
                    sh "docker tag mhaydi/thetiptop6archiwebback-${ENV_NAME}-nodejsimage ${DOCKERHUB_USERNAME}/thetiptop6archiwebback-${ENV_NAME}-nodejsimage"
                    sh "docker push ${DOCKERHUB_USERNAME}/thetiptop6archiwebback-${ENV_NAME}-nodejsimage"
                    }
                }
            }
        }

        stage("NodJS Unit Testing") {
            steps {
                script {
                     // Debugging: Check if the container is running
            sh "docker ps"

            // Debugging: Check if the test script exists in the container
            sh "docker exec thetiptop6archiwebback-${ENV_NAME} ls -l ./test.sh"

            // Debugging: Execute the test script
            sh "docker exec -i -e MONGO_USER=dbtiptop -e MONGO_PASSWORD=root2024 -e MONGO_HOST=databasecluster.b6fa6sm.mongodb.net -e MONGO_PORT=27017 -e MONGO_DB=thetiptop thetiptop6archiwebback-${ENV_NAME} sh -c './test.sh' || true"
                }
            }
        }
    }
}
