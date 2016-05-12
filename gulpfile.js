var gulp = require('gulp');
var gls = require('gulp-live-server');

gulp.task('default', function() {

  var server = gls('index.js', {
    env: {
      NODE_ENV: 'development'
    }
  });
  server.start();

  //use gulp.watch to trigger server actions(notify, start or stop)
  gulp.watch(['./static/index.css', 'index.html'], function(file) {
    server.notify.apply(server, [file]);
  });

  // Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
  gulp.watch(['index.js'], function() {
    server.start.bind(server)()
  });
});