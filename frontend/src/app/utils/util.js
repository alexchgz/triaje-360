import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/auth.service.ts';

export const getThemeColor = () => {
    let color = environment.defaultColor;
    try {
        color = localStorage.getItem(environment.themeColorStorageKey) || environment.defaultColor
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeColor -> error", error)
        color = environment.defaultColor
    }
    return color;
}
export const setThemeColor = (color) => {
    try {
        if (color) {
            localStorage.setItem(environment.themeColorStorageKey, color);
        } else {
            localStorage.removeItem(environment.themeColorStorageKey)
        }
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeColor -> error", error)
    }
}
export const getThemeRadius = () => {
    let radius = 'rounded';
    try {
        radius = localStorage.getItem(environment.themeRadiusStorageKey) || 'rounded';
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeRadius -> error", error)
        radius = 'rounded'
    }
    return radius;
}
export const setThemeRadius = (radius) => {
    try {
        localStorage.setItem(environment.themeRadiusStorageKey, radius);
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeRadius -> error", error)
    }
}

export const getThemeLang = () => {
    let lang = 'en-US';
    try {
        lang = localStorage.getItem('theme_lang') || 'en-US';
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getThemeLang -> error", error)
        lang = 'en-US'
    }
    return lang;
}
export const setThemeLang = (lang) => {
    try {
        localStorage.setItem('theme_lang', lang);
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setThemeLang -> error", lang)
    }
}

export const getUserRole = () => {
    let role = environment.defaultRole;
    let apiRol = -1;
    try {
        role = localStorage.getItem('rol') || environment.defaultRole;
    
        if (role == 'ROL_ADMIN') {
            apiRol = 0;
        } else if (role == 'ROL_PROFESOR') {
            apiRol = 1;
        } else if (role == 'ROL_ALUMNO') {
            apiRol = 2;
        }
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : getUserRole -> error", error)
        role = environment.defaultRole
    }
    return apiRol;
}
export const setUserRole = (role) => {
    try {
        localStorage.setItem('theme_user_role', role);
    } catch (error) {
        console.log(">>>> src/app/utils/util.js : setUserRole -> error", role)
    }
}
