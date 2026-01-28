from django import template
import json

register = template.Library()

@register.filter
def jsonify(value):
    return json.dumps(value, indent=2, ensure_ascii=False)

@register.filter
def jsonify_inline(value):
    return json.dumps(value, ensure_ascii=False)