#version 410 core

in vec2 fTexCoords;  // texture coordinates from vertex shader

out vec4 fColor;     // final color output

uniform sampler2D skyDomeTexture; // texture for the sky dome

void main()
{
    // Sample the sky dome texture and output it
    fColor = texture(skyDomeTexture, fTexCoords);
}
