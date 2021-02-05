import { SchemaTypes } from '@giraphql/core';
import { GraphQLResolveInfo } from 'graphql';
import { Path } from 'graphql/jsutils/Path';
import CacheNode from './cache-node';
import SubscriptionManager from './manager';

export default class SubscriptionCache<Types extends SchemaTypes> {
  manager: SubscriptionManager;

  builder: GiraphQLSchemaTypes.SchemaBuilder<Types>;

  currentCache = new Map<string, CacheNode<Types>>();

  nextCache = new Map<string, CacheNode<Types>>();

  invalidPaths: string[] = [];

  prevInvalidPaths: string[] = [];

  constructor(manager: SubscriptionManager, builder: GiraphQLSchemaTypes.SchemaBuilder<Types>) {
    this.manager = manager;
    this.builder = builder;
  }

  get(path: string, reRegister: boolean) {
    const node = this.currentCache.get(path);

    if (!node) {
      return null;
    }

    for (const invalid of this.prevInvalidPaths) {
      if (path.startsWith(invalid)) {
        return null;
      }
    }

    if (reRegister) {
      this.nextCache.set(path, node);
      node.reRegister();
    }

    return node;
  }

  getTypeSubscriber(type: string) {
    const config = this.builder.configStore.getTypeConfig(type, 'Object');

    if (config.graphqlKind === 'Object') {
      return config.giraphqlOptions.subscribe || null;
    }

    return null;
  }

  getParent(info: GraphQLResolveInfo): CacheNode<Types> | null {
    let parentPath = info.path.prev;

    if (!parentPath) {
      return null;
    }

    if (typeof parentPath.key === 'number') {
      parentPath = parentPath.prev!;
    }

    const parentKey = this.cacheKey(parentPath);

    if (this.nextCache.has(parentKey)) {
      return this.nextCache.get(parentKey)!;
    }

    return null;
  }

  managerForParentType(info: GraphQLResolveInfo) {
    const parentPath = info.path.prev;

    if (!parentPath) {
      return null;
    }

    const isListItem = typeof parentPath.key === 'number';

    const parentKey = this.cacheKey(isListItem ? parentPath.prev! : parentPath);
    const parentCacheNode = this.nextCache.get(parentKey);

    return parentCacheNode?.managerForType(parentPath.key) || null;
  }

  add(info: GraphQLResolveInfo, path: string, canRefetch: boolean, value: unknown) {
    const parent = this.getParent(info);

    const node = new CacheNode(
      this,
      path,
      value,
      canRefetch || !parent ? () => void this.invalidPaths.push(path) : parent.refetch,
    );

    this.nextCache.set(path, node);

    return node;
  }

  next() {
    this.prevInvalidPaths = this.invalidPaths;
    this.invalidPaths = [];
    this.currentCache = this.nextCache;
    this.nextCache = new Map<string, CacheNode<Types>>();
  }

  cacheKey(path: Path) {
    let { key, prev } = path;

    while (prev) {
      key = `${prev.key}.${key}`;
      prev = prev.prev;
    }

    return key.toString();
  }
}
