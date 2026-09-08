import bpy
import json


def vector(value):
    return [round(component, 5) for component in value]


scene = bpy.context.scene
inventory = {
    "scene": scene.name,
    "frame_range": [scene.frame_start, scene.frame_end],
    "fps": scene.render.fps,
    "engine": scene.render.engine,
    "resolution": [scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage],
    "camera": scene.camera.name if scene.camera else None,
    "world_color": vector(scene.world.color) if scene.world else None,
    "objects": [],
    "materials": [],
    "images": [],
}

for obj in sorted(bpy.data.objects, key=lambda item: item.name):
    inventory["objects"].append({
        "name": obj.name,
        "type": obj.type,
        "parent": obj.parent.name if obj.parent else None,
        "location": vector(obj.location),
        "rotation": vector(obj.rotation_euler),
        "scale": vector(obj.scale),
        "dimensions": vector(obj.dimensions),
        "hidden_render": obj.hide_render,
        "materials": [slot.material.name for slot in obj.material_slots if slot.material],
        "animation": obj.animation_data.action.name if obj.animation_data and obj.animation_data.action else None,
    })

for material in sorted(bpy.data.materials, key=lambda item: item.name):
    inventory["materials"].append({
        "name": material.name,
        "use_nodes": material.use_nodes,
        "node_names": sorted(node.name for node in material.node_tree.nodes) if material.use_nodes else [],
    })

for image in sorted(bpy.data.images, key=lambda item: item.name):
    inventory["images"].append({
        "name": image.name,
        "filepath": bpy.path.abspath(image.filepath) if image.filepath else "",
        "source": image.source,
        "size": list(image.size),
    })

print("CADENCE_SCENE_STATE=" + json.dumps(inventory, separators=(",", ":")))
