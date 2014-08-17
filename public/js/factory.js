'use strict';

ngAuth.factory('GUI', function() {
    return require('nw.gui');
}).factory('Window', ['GUI',
    function(gui) {
        return gui.Window.get();
    }
]);
