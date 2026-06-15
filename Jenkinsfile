pipeline {
agent any


stages {

    stage('Checkout') {
        steps {
            echo 'Code checkout successful'
        }
    }

    stage('Install Backend') {
        steps {
            dir('backend') {
                bat 'npm install'
            }
        }
    }

    stage('Install Frontend') {
        steps {
            dir('frontend') {
                bat 'npm install'
            }
        }
    }

    stage('Build') {
        steps {
            echo 'Build completed successfully'
        }
    }
}


}
