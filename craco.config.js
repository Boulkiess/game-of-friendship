module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const sourceMapLoaderRule = webpackConfig.module.rules.find(
                (rule) =>
                    rule.enforce === 'pre' &&
                    rule.use &&
                    rule.use.some((use) => use.loader && use.loader.includes('source-map-loader'))
            );
            if (sourceMapLoaderRule) {
                sourceMapLoaderRule.exclude = /node_modules/;
            }
            return webpackConfig;
        },
    },
};
