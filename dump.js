function toJSON(rootObject, replacer, spacer) {
    var cache = [];
    var plainJavaScriptObject = ko.toJS(rootObject);
    var replaceFunction = replacer || cycleReplacer;
    var output = ko.utils.stringifyJson(plainJavaScriptObject, replaceFunction, spacer || 2);
    cache = null;
    return output;

    function cycleReplacer(key, value) { // in case Ella is a child of Max is a chld of Ella is a child of Max....
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return; // cycle is found, skip it
            }
            cache.push(value);
        }

        return value;
    }
}

ko.bindingHandlers.dump = {
    init: function (element, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
        var context = valueAccessor();
        var allBindings = allBindingsAccessor();
        var pre = document.createElement('pre'); // a frame to expose json, tag: <pre></pre>

        element.appendChild(pre);

        var dumpJSON = ko.computed({
            read: function () {
                // enabling :
                var en = allBindings.enable === undefined || allBindings.enable;

                //           (rootObject, replacer, spacer)
                return en ? toJSON(context, null, 2) : '';
            },
            disposeWhenNodeIsRemoved: element
        });

        ko.applyBindingsToNode(pre,
            {
                text: dumpJSON,
                visible: dumpJSON
            }
        );

    }
};