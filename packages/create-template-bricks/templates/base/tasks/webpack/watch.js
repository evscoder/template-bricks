import gulp from 'gulp';
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.js';
import userConfig from '../../user.config.js';

const watchWebpack = done => {
    const compiler = webpack(webpackConfig.map(config => ({
        ...config,
        mode: 'development'
    })));

    const rebuildWebpack = complete => {
        compiler.run((error, stats) => {
            if (error) {
                console.error(error);
            }

            if (stats) {
                const details = stats.toString({
                    all: false,
                    errors: true,
                    warnings: true,
                    colors: Boolean(process.stdout.isTTY)
                });

                if (details) {
                    console.log(details);
                }
            }

            // Keep watching after errors so the next edit can fix the build.
            complete();
        });
    };

    // npm start completes the standalone build before reaching this task.
    gulp.watch([
        `${userConfig.sourceFolder}/**/*`,
        'tsconfig*.json',
        'tailwind.config.js',
        'postcss.config.mjs'
    ], {
        ignoreInitial: true,
        delay: 100
    }, rebuildWebpack);

    done();
};

export default watchWebpack;
