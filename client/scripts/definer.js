import angular from 'angular';
import * as Entities from './entities';

export default class Definer {
  constructor(module, dependencies) {
    if (_.isString(module)) {
      module = angular.module(module, dependencies);
    }

    this.module = module;
  }

  define(Entity, ...args) {
    if (_.isFunction(Entity)) {
      const proto = Entity.prototype;
      Entity.$inject = Entity.$inject || [];

      if (proto instanceof Entities.Controller)
        this._defineController(Entity);
      else if (proto instanceof Entities.Provider)
        this._defineProvider(Entity);
      else if (proto instanceof Entities.Service)
        this._defineService(Entity);
      else if (proto instanceof Entities.Decorator)
        this._defineDecorator(Entity);
      else if (proto instanceof Entities.Directive)
        this._defineDirective(Entity);
      else if (proto instanceof Entities.Factory)
        this._defineFactory(Entity);
      else if (proto instanceof Entities.Filter)
        this._defineFilter(Entity);
      else if (proto instanceof Entities.Config)
        this._defineConfig(Entity);
      else if (proto instanceof Entities.Runner)
        this._defineRunner(Entity);
      else
        throw Error("can't define unknown entity type");
    }
    else {
      this.module[Entity](...args);
    }

    return this;
  }

  _defineProvider(Provider) {
    this.module.provider(Provider.name, Provider);
  }

  _defineController(Controller) {
    this.module.controller(Controller.name, Controller);
  }

  _defineService(Service) {
    this.module.service(Service.name, Service)
  }

  _defineDecorator(Decorator) {
    function handler() {
      const decorator = new Decorator(...arguments);
      return decorator.decorate.bind(decorator);
    }

    handler.$inject = Decorator.$inject;
    this.module.decorator(Decorator.name, handler);
  }

  _defineDirective(Directive) {
    function handler() {
      return new Directive(...arguments);
    }

    handler.$inject = Directive.$inject;
    this.module.directive(Directive.name, handler);
  }

  _defineFactory(Factory) {
    function handler() {
      const factory = new Factory(...arguments);
      return factory.create.bind(factory);
    }

    handler.$inject = Factory.$inject;
    this.module.factory(Factory.name, handler);
  }

  _defineFilter(Filter) {
    function handler() {
      const filter = new Filter(...arguments);
      return filter.filter.bind(filter);
    }

    handler.$inject = Filter.$inject;
    this.module.filter(Filter.name, handler);
  }

  _defineConfig(Config) {
    function handler() {
      const config = new Config(...arguments);
      return config.configure();
    }

    handler.$inject = Config.$inject;
    this.module.config(handler);
  }

  _defineRunner(Runner) {
    function handler() {
      const runner = new Runner(...arguments);
      return runner.run();
    }

    handler.$inject = Runner.$inject;
    this.module.run(handler);
  }
}