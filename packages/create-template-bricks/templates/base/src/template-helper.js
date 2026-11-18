export default ({ pathPrefix = '' } = {}) => {
    const basePath = `${pathPrefix.replace(/\/?$/, '/')}assets`;

    const asset = (path) => `${basePath}/${path.replace(/^\/+/, '')}`;

    return {
        PATH: pathPrefix,
        asset
    };
};
