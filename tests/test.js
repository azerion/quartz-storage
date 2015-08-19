var expect = chai.expect;

beforeEach( function () {
    //empty the localStorage
    localStorage.clear();

    //Empty the cookie storage
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
});

describe("Quartz.Storage", function () {
    var namespace = 'test';

    describe("constructor", function () {
        it("should get a local store", function () {
            var storage = new Quartz.Storage();
            expect(storage.store).to.be.instanceof(Quartz.LocalStorage);
        });
    });

    describe("constructor fallback", function () {
        var storageSetItem;
        before(function () {
            storageSetItem = localStorage.setItem;
            localStorage.setItem = function () { throw new Error()};
        });
        it("should get a cookie store if localStorage is not available", function () {
            var storage = new Quartz.Storage();
            expect(storage.store).to.be.instanceof(Quartz.CookieStorage);
        });
        after(function () {

           localStorage.setItem = storageSetItem;
        });
    });

    describe("getInstance", function () {
        it("should return a previously made instance", function () {
            var storage = Quartz.Storage.getInstance();
            expect(storage).to.equal(Quartz.Storage.getInstance())
        });
    });

    describe("setNamespace", function () {
        it("should set the namespace of the store", function () {
            var storage = Quartz.Storage.getInstance();
            expect(storage.setNamespace(namespace)).to.equal(Quartz.Storage.getInstance());
            expect(storage.store.namespace).to.equal(namespace + ':');
        });

        it("should throw an error if no store is specified", function () {
            var storage = new Quartz.Storage();
            storage.store = null;
            expect(function () {
                storage.setNamespace(namespace);
            }).to.throw(Error);
        });
    });

    describe("get", function () {
        it("should fetch an previously set item", function () {
            var storage = new Quartz.Storage();
            storage.set('foo', 'bar');
            expect(storage.get('foo')).to.equal('bar')
        });

        it("should throw an error if no store is specified", function () {
            var storage = Quartz.Storage.getInstance();
            storage.store = null;
            expect(function () {
                storage.get('foo');
            }).to.throw(Error);
        });
    });

    describe("set", function () {
        it("should fetch an previously set item", function () {
            //var storage = Quartz.Storage.getInstance();
            //expect(storage).to.equal(Quartz.Storage.getInstance())
        });

        it("should throw an error if no store is specified", function () {
            var storage = new Quartz.Storage();
            storage.store = null;
            expect(function () {
                storage.set('foo', 'bar');
            }).to.throw(Error);
        });
    });
});

describe("Quartz.CookieStorage", function () {
    var namespace = 'test';
    var otherNamespace = 'testtest';

    describe("constructor", function () {
        it("should have no namespace", function () {
            var storage = new Quartz.CookieStorage();
            expect(storage.namespace).to.equal('');
        });

        it("should have namespace when specified", function () {
            var storage = new Quartz.CookieStorage(namespace);
            expect(storage.namespace).to.equal(namespace + ':');
        });
    });

    describe("length", function () {
        it("should increase when objects are stored", function () {
            var storage = new Quartz.CookieStorage(namespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);
        });

        it("should only give the length within the current given namespace", function () {
            var storage = new Quartz.CookieStorage(namespace);
            expect(storage.length).to.equal(0);

            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setNamespace(otherNamespace);
            expect(storage.length).to.equal(0);

            storage.setItem('foo', 'bar');
            storage.setItem('bar', 'baz');
            expect(storage.length).to.equal(2);
        });
    });

    describe("setItem", function () {
        it("Should add an item to the storage if it doesnt exist", function () {
            var storage = new Quartz.CookieStorage(namespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);
        });

        it("Should change the value of an item if it exists", function () {
            var storage = new Quartz.CookieStorage(namespace);
            expect(storage.length).to.equal(0);

            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setItem('foo', 'baz');
            expect(storage.length).to.equal(1);
            expect(storage.getItem('foo')).to.equal('baz');
        });
    });
    describe("setNamespace", function () {
        it("should change the existing namespace", function () {
            var storage = new Quartz.CookieStorage(namespace);

            storage.setItem('foo', 'bar');

            var oldnameSpace = storage.namespace;
            storage.setNamespace(otherNamespace);

            expect(storage.namespace).to.not.equal(oldnameSpace);
            expect(storage.namespace).to.equal(otherNamespace + ':');
            expect(storage.length).to.equal(0);
            expect(storage.getItem('foo')).to.equal(null);
        });
    });

    describe("deleteItem", function () {
        it("should remove an value from the storage", function () {
            var storage = new Quartz.CookieStorage(namespace);

            storage.setItem('foo', 'bar');
            expect(storage.getItem('foo')).to.equal('bar');
            expect(storage.length).to.equal(1);

            storage.deleteItem('foo');
            expect(storage.getItem('foo')).to.equal(null);
            expect(storage.length).to.equal(0);
        });
    });

    describe("empty", function () {
        it("should remove all stored values within a namespace", function () {
            var storage = new Quartz.CookieStorage(namespace);

            storage.setItem('foo', 'bar');
            storage.setItem('bar', 'baz');
            storage.setItem('baz', 'foo');
            expect(storage.length).to.equal(3);

            storage.setNamespace(otherNamespace);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setNamespace(namespace);
            storage.empty();

            expect(storage.length).to.equal(0);
            expect(storage.getItem('foo')).to.equal(null);

            storage.setNamespace(otherNamespace);
            expect(storage.getItem('foo')).to.equal('bar');
        });
    });
});

describe("Quartz.LocalStorage", function () {
    var namespace = 'test';
    var otherNamespace = 'testtest';

    describe("constructor", function () {
        it("should have no namespace", function () {
            var storage = new Quartz.LocalStorage();
            expect(storage.namespace).to.equal('');
        });

        it("should have namespace when specified", function () {
            var storage = new Quartz.LocalStorage(namespace);
            expect(storage.namespace).to.equal(namespace + ':');
        });
    });

    describe("length", function () {
        it("should increase when objects are stored", function () {
            var storage = new Quartz.LocalStorage(namespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);
        });

        it("should only give the length within the current given namespace", function () {
            var storage = new Quartz.LocalStorage(namespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setNamespace(otherNamespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);
        });
    });

    describe("setItem", function () {
        it("Should add an item to the storage if it doesnt exist", function () {
            var storage = new Quartz.LocalStorage(namespace);
            expect(storage.length).to.equal(0);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);
        });

        it("Should change the value of an item if it exists", function () {
            var storage = new Quartz.LocalStorage(namespace);
            expect(storage.length).to.equal(0);

            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setItem('foo', 'baz');
            expect(storage.length).to.equal(1);
            expect(storage.getItem('foo')).to.equal('baz');
        });
    })

    describe("setNamespace", function () {
        it("should change the existing namespace", function () {
            var storage = new Quartz.LocalStorage(namespace);

            storage.setItem('foo', 'bar');

            var oldnameSpace = storage.namespace;
            storage.setNamespace(otherNamespace);

            expect(storage.namespace).to.not.equal(oldnameSpace);
            expect(storage.namespace).to.equal(otherNamespace + ':');

            expect(storage.getItem('foo')).to.equal(null);
        });
    });

    describe("deleteItem", function () {
        it("should remove an value from the storage", function () {
            var storage = new Quartz.LocalStorage(namespace);

            storage.setItem('foo', 'bar');
            expect(storage.getItem('foo')).to.equal('bar');
            expect(storage.length).to.equal(1);

            storage.deleteItem('foo');
            expect(storage.getItem('foo')).to.equal(null);
            expect(storage.length).to.equal(0);
        });
    });

    describe("empty", function () {
        it("should remove all stored values within a namespace", function () {
            var storage = new Quartz.LocalStorage(namespace);

            storage.setItem('foo', 'bar');
            storage.setItem('bar', 'baz');
            storage.setItem('baz', 'foo');
            expect(storage.length).to.equal(3);

            storage.setNamespace(otherNamespace);
            storage.setItem('foo', 'bar');
            expect(storage.length).to.equal(1);

            storage.setNamespace(namespace);
            storage.empty();

            expect(storage.length).to.equal(0);
            expect(storage.getItem('foo')).to.equal(null);

            storage.setNamespace(otherNamespace);
            expect(storage.getItem('foo')).to.equal('bar');
        });
    });
});