function getEnvironment() {
    // detect environment from hostname
    const hostname = window.location.hostname;
    const allLocalhost = ['localhost', '192.168', '127.0'];

    if (allLocalhost.some((v) => hostname.includes(v))) {
        return 'development';
    }

    return 'production';
}

export default getEnvironment;