#include "Camera.hpp"

namespace gps {

    // Camera constructor
    Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
        this->cameraPosition = cameraPosition;
        this->cameraTarget = cameraTarget;
        this->cameraUpDirection = cameraUp;

        // Compute initial directions
        this->cameraFrontDirection = glm::normalize(cameraTarget - cameraPosition);
        this->cameraRightDirection = glm::normalize(glm::cross(this->cameraFrontDirection, this->cameraUpDirection));
        this->cameraUpDirection = glm::normalize(glm::cross(this->cameraRightDirection, this->cameraFrontDirection));
    }

    // Return the view matrix, using the glm::lookAt() function
    glm::mat4 Camera::getViewMatrix() {
        return glm::lookAt(cameraPosition, cameraPosition + cameraFrontDirection, cameraUpDirection);
    }

    // Move the camera in the given direction by the given speed
    void Camera::move(MOVE_DIRECTION direction, float speed) {
        switch (direction) {
        case MOVE_FORWARD:
            cameraPosition += cameraFrontDirection * speed;
            break;
        case MOVE_BACKWARD:
            cameraPosition -= cameraFrontDirection * speed;
            break;
        case MOVE_LEFT:
            cameraPosition -= cameraRightDirection * speed;
            break;
        case MOVE_RIGHT:
            cameraPosition += cameraRightDirection * speed;
            break;
        case MOVE_UP:
            cameraPosition += glm::vec3(0.0f, 1.0f, 0.0f) * speed; // Move up along Y-axis
            break;
        case MOVE_DOWN:
            cameraPosition -= glm::vec3(0.0f, 1.0f, 0.0f) * speed; // Move down along Y-axis
            break;
        }
    }

    // Update the camera's internal parameters following a camera rotate event
    // yaw - camera rotation around the Y axis
    // pitch - camera rotation around the X axis
    void Camera::rotate(float pitch, float yaw) {
        if (pitch < -89)
            pitch = -89;
        if (pitch > 89)
            pitch = 89;

        glm::vec3 front;
        front.x = cos(glm::radians(yaw)) * cos(glm::radians(pitch));
        front.y = sin(glm::radians(pitch));
        front.z = sin(glm::radians(yaw)) * cos(glm::radians(pitch));

        this->cameraFrontDirection = glm::normalize(front);
        this->cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, glm::vec3(0.0f, 1.0f, 0.0f)));
        this->cameraUpDirection = glm::normalize(glm::cross(cameraRightDirection, cameraFrontDirection));
    }

    // Getter method to return camera position
    glm::vec3 Camera::getPosition() const {
        return cameraPosition;
    }


   

    void Camera::viewScene(float angle)
    {
        // Set the initial position of the camera
        glm::vec3 initialPosition(-10.0f, 15.0f, 30.0f);

        // Create a rotation matrix around the Y-axis
        glm::mat4 rotationMatrix = glm::rotate(glm::mat4(1.0f), glm::radians(angle), glm::vec3(0.0f, 1.0f, 0.0f));

        // Apply the rotation matrix to the initial position and update the camera position
        glm::vec4 transformedPosition = rotationMatrix * glm::vec4(initialPosition, 1.0f);
        this->cameraPosition = glm::vec3(transformedPosition);

        // Recalculate the camera's front and right direction vectors
        this->cameraFrontDirection = glm::normalize(cameraTarget - cameraPosition);
        this->cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, glm::vec3(0.0f, 1.0f, 0.0f)));
    }

}
