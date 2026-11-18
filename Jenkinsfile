pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "notipoli-ci"
    }

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
                sh 'docker compose build'
            }
        }

        stage('Pruebas y Verificación Automática (3 Contenedores)') {
            steps {
                echo '=== ETAPA 3: Levantando los 3 servicios y verificando comunicación por red bridge ==='
                // Levantar los 3 contenedores en segundo plano
                sh 'docker compose up -d'

                // Mostrar estado de los 3 contenedores activos
                sh 'docker compose ps'

                // Esperar a que la base de datos (PostgreSQL) y el backend se inicien correctamente
                echo 'Esperando inicialización de la base de datos y backend...'
                sh 'sleep 15'

                // Verificación de conectividad del Backend (NestJS)
                echo 'Verificando respuesta HTTP del Backend (puerto 3000)...'
                sh 'curl -f http://localhost:3000/ || exit 1'

                // Verificación de conectividad del Frontend (React + Nginx)
                echo 'Verificando respuesta HTTP del Frontend (puerto 3001)...'
                sh 'curl -f http://localhost:3001/ || exit 1'
            }
        }
    }

    post {
        always {
            echo '=== BLOQUE POST: Limpieza del entorno de pruebas (deteniendo los 3 contenedores) ==='
            sh 'docker compose down -v --rmi local || true'
        }
        success {
            echo '¡ÉXITO! El Pipeline de Jenkins validó correctamente los 3 contenedores y su comunicación.'
        }
        failure {
            echo '¡FALLO! El Pipeline ha fallado en la compilación o en las pruebas de comunicación de los servicios.'
        }
    }
}
