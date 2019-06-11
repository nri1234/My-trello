document.addEventListener('DOMContentLoaded', function () {

    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');

        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);

        return element;
    }

    function Column(name) {
        var self = this;
        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', {
            name: this.name,
            id: this.id
        });

        this.element.querySelector('.column').addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }

            if (event.target.classList.contains('add-card')) {
                var nameAdded = prompt("Enter the name of the card");
                if (nameAdded != null) { //nameAdded is name typed in prompt, can't be equal zero (cancel, othervise add card//
                    self.addCard(new Card(nameAdded));
                }
            }
        });
        //this.element.querySelector('.column').addEventListener('click', function (event) {
        // if (event.target.classList.contains('btn-delete')) {
        //    self.removeColumn();
        // }

        // if (event.target.classList.contains('add-card')) {
        //   self.addCard(new Card(prompt('Enter the name of the card')));
        // }
        // });
    }

    Column.prototype = {
        addCard: function (card) {
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function () {
            this.element.parentNode.removeChild(this.element);
        }
    };

    function Card(description) {
        var self = this;

        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', {
            description: this.description
        }, 'li');

        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();

            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }
        });
    }

    Card.prototype = {
        removeCard: function () {
            this.element.parentNode.removeChild(this.element);
        }
    }

    var board = {
        name: 'Kanban Board',
        addColumn: function (column) {
            this.element.appendChild(column.element);
            initSortable(column.id);
        },
        element: document.querySelector('#board .column-container')
    };

    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true
        });
    }

    document.querySelector('#board .create-column').addEventListener('click', function () {
        var nameAdded = prompt('Enter a column name');
        if (nameAdded != null) {
            var name = nameAdded;
            var column = new Column(name || 'Unnamed');
            board.addColumn(column);
        }

    });

    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Loading');
    var doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    var card1 = new Card('New task');
    var card2 = new Card('Create kanban boards');
    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);


});
