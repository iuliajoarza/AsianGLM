#version 410 core

in vec3 fNormal;
in vec4 fPosEye;
in vec2 fTexCoords;
in vec4 fragPosLightSpace;
uniform sampler2D shadowMap;

float shadow;

uniform vec3 lightPosition;
uniform int luminaPunctiforma;

uniform mat4 view;

out vec4 fColor;

uniform vec3 lightDir;
uniform vec3 lightColor;

uniform mat3 normalMatrix;
uniform mat3 lightDirMatrix;

uniform int ceata;

// Textures
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;

vec3 ambient;
vec3 diffuse;
vec3 specular;

float ambientStrength = 0.2f;
float specularStrength = 0.5f;
float shininess = 32.0f;
float bias = 0.005f;

float constant = 1.0f;
float linear = 0.0045f;
float quadratic = 0.0075f;
float att;

void computeLightComponents() {
    vec3 cameraPosEye = vec3(0.0f); // In eye coordinates, the camera is at the origin
    vec3 normalEye = normalize(fNormal); // Normalize the fragment normal
    vec3 lightDirN = normalize(lightDir); // Normalize light direction
    vec3 viewDirN = normalize(cameraPosEye - fPosEye.xyz); // Compute view direction
    vec3 halfVector = normalize(lightDirN + viewDirN); // Compute half-vector

    ambient = ambientStrength * lightColor; // Ambient lighting
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor; // Diffuse lighting
    vec3 reflection = reflect(-lightDirN, normalEye); // Reflection vector
    float specCoeff = pow(max(dot(viewDirN, reflection), 0.0f), shininess); // Specular coefficient
    specular = specularStrength * specCoeff * lightColor; // Specular lighting
}

float computeShadow() {
    vec3 normalizedCoords = fragPosLightSpace.xyz / fragPosLightSpace.w; // Perspective divide
    normalizedCoords = normalizedCoords * 0.5 + 0.5; // Transform to [0,1] range
    float closestDepth = texture(shadowMap, normalizedCoords.xy).r; // Depth from shadow map
    float currentDepth = normalizedCoords.z; // Depth of current fragment
    float shadow = currentDepth - bias > closestDepth ? 1.0 : 0.0; // Shadow check

    if (normalizedCoords.z > 1.0f) return 0.0f; // Ignore fragments outside light's range
    return shadow;
}

float computeFog() {
    float fogDensity = 0.02f;
    float fragmentDistance = length(fPosEye);
    float fogFactor = exp(-pow(fragmentDistance * fogDensity, 2)); // Fog factor calculation
    return clamp(fogFactor, 0.0f, 1.0f);
}

void computePointLight() {
    computeLightComponents();
    vec4 lightPosEye = view * vec4(lightPosition, 1.0f); // Transform light position to eye space
    float distance = length(lightPosEye.xyz - fPosEye.xyz); // Distance to light
    att = 1.0f / (constant + linear * distance + quadratic * distance * distance); // Attenuation factor
}

void main() {
    computeLightComponents();

    vec3 baseColor = vec3(0.9f, 0.35f, 0.0f); // Orange base color

    ambient *= texture(diffuseTexture, fTexCoords).rgb; // Apply diffuse texture to ambient
    diffuse *= texture(diffuseTexture, fTexCoords).rgb; // Apply diffuse texture
    specular *= texture(specularTexture, fTexCoords).rgb; // Apply specular texture

    shadow = computeShadow();

    vec3 color = min((ambient + (1.0f - shadow) * diffuse) + (1.0f - shadow) * specular, 1.0f);
    vec3 light = vec3(1.0f, 1.0f, 1.0f); // Default light intensity

    if (luminaPunctiforma == 1) {
        computePointLight();
        light = ambient + diffuse + specular + (ambient + diffuse + specular) * att; // Add attenuation
    }

    if (ceata == 0) {
        fColor = vec4(color, 1.0f) * vec4(light, 1.0f); // Combine lighting
    } else {
        float fogFactor = computeFog();
        vec4 fogColor = vec4(0.5f, 0.5f, 0.5f, 1.0f); // Gray fog color
        fColor = fogColor * (1.0f - fogFactor) + vec4(color, 1.0f) * fogFactor; // Blend fog and color
    }
}
