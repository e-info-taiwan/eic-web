import { CompositeDecorator } from 'draft-js'
import { entityDecorators } from './entity-decorators'

const { annotationDecorator, footnoteDecorator, linkDecorator } =
  entityDecorators

const decorators = new CompositeDecorator([
  annotationDecorator,
  footnoteDecorator,
  linkDecorator,
])

export default decorators
