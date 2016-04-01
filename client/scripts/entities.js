class Injectable {
  constructor() {
    this.constructor.$inject.forEach((name, i) => {
      this[name] = arguments[i];
    });
  }
}

export class Controller extends Injectable {
  constructor() {
    super(...arguments);

    const createViewModel = this.$scope &&
      (this.$scope.viewModel || this.$scope.$viewModel);

    if (createViewModel) {
      createViewModel.call(this.$scope, this);
    }
  }
}

export class Provider extends Injectable {
}

export class Service extends Injectable {
}

export class Directive extends Injectable {
  compile() {
    return this.link.bind(this);
  }
}

export class Decorator extends Injectable {
  decorate() {
    throw Error('Decorator#decorate() must be implemented');
  }
}

export class Factory extends Injectable {
  create() {
    throw Error('Factory#create() must be implemented');
  }
}

export class Filter extends Injectable {
  filter() {
    throw Error('Filter#filter() must be implemented');
  }
}

export class Config extends Injectable {
  configure() {
    throw Error('Config#configure() must be implemented');
  }
}

export class Runner extends Injectable {
  run() {
    throw Error('Runner#run() must be implemented');
  }
}
