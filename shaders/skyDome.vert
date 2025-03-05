#version 410 core

layout(location = 0) in vec3 position; // vertex position
layout(location = 1) in vec2 texCoords; // texture coordinates

out vec2 fTexCoords; // texture coordinates to fragment shader

uniform mat4 model;         // model matrix
uniform mat4 view;          // view matrix
uniform mat4 projection;    // projection matrix

void main()
{
    // Set the position of the vertices in the world space
    gl_Position = projection * view * model * vec4(position, 1.0);
    fTexCoords = texCoords; // Pass texture coordinates to fragment shader
}
