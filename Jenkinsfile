pipeline {
    agent any

    environment {
        DOCKER_PATH = '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== ETAPA 1: Clonando código fuente desde GitHub ==='
                checkout scm
            }
        }

        stage('Build 3 Contenedores (Entrega 1)') {
            steps {
                echo '=== ETAPA 2: Construyendo imágenes Docker (db-postgres, back-nest, front-react) ==='
                withCredentials([
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-pass', variable: 'DB_PASS'),
                    string(credentialsId: 'db-name', variable: 'DB_NAME')
                ]) {
                    bat "set DB_USER=${DB_USER}&& set DB_PASS=${DB_PASS}&& set DB_NAME=${DB_NAME}&& ${env.DOCKER_PATH} compose build"
                }
            }
        }

        stage('Pruebas y Verificación Automática (3 Contenedores)') {
            steps {
                echo '=== ETAPA 3: Limpieza forzada y levantando servicios ==='
                bat "${env.DOCKER_PATH} compose down -v --remove-orphans || exit /b 0"
                bat "${env.DOCKER_PATH} rm -f notipoli-db notipoli-back notipoli-front || exit /b 0"

                withCredentials([
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-pass', variable: 'DB_PASS'),
                    string(credentialsId: 'db-name', variable: 'DB_NAME')
                ]) {
                    bat "set DB_USER=${DB_USER}&& set DB_PASS=${DB_PASS}&& set DB_NAME=${DB_NAME}&& ${env.DOCKER_PATH} compose up -d --force-recreate"
                }
                bat "${env.DOCKER_PATH} compose ps"

                echo 'Esperando inicialización de la base de datos y backend...'
                bat 'ping 127.0.0.1 -n 16 > nul'

                echo 'Verificando respuesta HTTP del Backend (puerto 3000 con curl -I)...'
                bat 'curl -I http://localhost:3000/ || exit /b 1'

                echo 'Verificando respuesta HTTP del Frontend (puerto 3001)...'
                bat 'curl -f http://localhost:3001/ || exit /b 1'
            }
        }
    }

    post {
        always {
            echo '=== BLOQUE POST: Limpieza del entorno de pruebas ==='
            withCredentials([
                string(credentialsId: 'db-user', variable: 'DB_USER'),
                string(credentialsId: 'db-pass', variable: 'DB_PASS'),
                string(credentialsId: 'db-name', variable: 'DB_NAME')
            ]) {
                bat "set DB_USER=${DB_USER}&& set DB_PASS=${DB_PASS}&& set DB_NAME=${DB_NAME}&& ${env.DOCKER_PATH} compose down -v --rmi local || exit /b 0"
            }
        }
        success {
            echo '¡ÉXITO! El Pipeline validó correctamente los 3 contenedores y su comunicación.'
        }
        failure {
            echo '¡FALLO! El Pipeline ha fallado en la compilación o pruebas.'
        }
    }
}
