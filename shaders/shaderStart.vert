#version 410 core

layout(location=0) in vec3 vPosition; // Vertex position
layout(location=1) in vec3 vNormal;   // Vertex normal
layout(location=2) in vec2 vTexCoords; // Vertex texture coordinates

out vec3 fNormal; // Normal in eye space
out vec4 fPosEye; // Position in eye space (camera space)
out vec2 fTexCoords; // Texture coordinates

out vec4 fragPosLightSpace; // Position in light space for shadow mapping

uniform mat4 lightSpaceTrMatrix; // Light space transformation matrix
uniform mat4 model;  // Model matrix
uniform mat4 view;   // View matrix (camera transformation)
uniform mat4 projection; // Projection matrix
uniform mat3 normalMatrix; // Normal matrix (for normal transformation)

void main() 
{
    
    fPosEye = view * model * vec4(vPosition, 1.0f);
    
    fNormal = normalize(normalMatrix * vNormal);
    
    fTexCoords = vTexCoords;
    
    gl_Position = projection * view * model * vec4(vPosition, 1.0f);
    
    fragPosLightSpace = lightSpaceTrMatrix * model * vec4(vPosition, 1.0f);
}
