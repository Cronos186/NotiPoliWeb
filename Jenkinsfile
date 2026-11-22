pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '=== ETAPA 1: Clonando o actualizando código fuente desde GitHub ==='
                checkout scm
            }
        }

        stage('Build 3 Contenedores (Entrega 1)') {
            steps {
                echo '=== ETAPA 2: Construyendo imágenes Docker (db-postgres, back-nest, front-react) ==='
                bat 'docker compose build'
            }
        }

        stage('Pruebas y Verificación Automática (3 Contenedores)') {
            steps {
                echo '=== ETAPA 3: Levantando los 3 servicios y verificando comunicación por red bridge ==='
                bat 'docker compose up -d'
                bat 'docker compose ps'

                echo 'Esperando inicialización de la base de datos y backend...'
                bat 'timeout /t 15 /nobreak > NUL'

                echo 'Verificando respuesta HTTP del Backend (puerto 3000)...'
                bat 'curl -f http://localhost:3000/ || exit /b 1'

                echo 'Verificando respuesta HTTP del Frontend (puerto 3001)...'
                bat 'curl -f http://localhost:3001/ || exit /b 1'
            }
        }
    }

    post {
        always {
            echo '=== BLOQUE POST: Limpieza del entorno de pruebas (deteniendo los 3 contenedores) ==='
            bat 'docker compose down -v --rmi local || exit /b 0'
        }
        success {
            echo '¡ÉXITO! El Pipeline de Jenkins validó correctamente los 3 contenedores y su comunicación.'
        }
        failure {
            echo '¡FALLO! El Pipeline ha fallado en la compilación o en las pruebas de comunicación de los servicios.'
        }
    }
}