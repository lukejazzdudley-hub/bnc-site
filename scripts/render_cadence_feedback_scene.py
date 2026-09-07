import bpy
import math
import os
from pathlib import Path


output_directory = Path(os.environ["CADENCE_FEEDBACK_FRAME_DIR"])
output_directory.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
phone = bpy.data.objects["CTRL-F03V5-b01-v8-library"]
screen = bpy.data.objects["GEO-Cadence-real-screen-F03V5-b01-v8-library"]
if screen.hide_render or phone.hide_render:
    raise ValueError("verified Cadence handset is not render-visible")

material = bpy.data.materials["MAT-F03V5-screen-b01-v8-library"]
locked_textures = [node for node in material.node_tree.nodes if node.type == "TEX_IMAGE" and node.name.startswith("LOCKED-")]
if {node.name for node in locked_textures} != {"LOCKED-arctic", "LOCKED-neon", "LOCKED-crimson"}:
    raise ValueError("theme-derived blend does not contain all locked captures")
material.node_tree.animation_data_clear()
for node in material.node_tree.nodes:
    if node.type == "MIX_RGB":
        node.inputs[0].default_value = 0.0

phone.animation_data_clear()
poses = (
    (1, (0.40, 0.0, -0.02), (-0.5, 10.0, -5.5), 0.86),
    (58, (0.03, 0.0, 0.0), (-0.8, 6.0, -1.5), 1.03),
    (90, (0.03, 0.0, 0.0), (-0.8, 6.0, -1.5), 1.03),
)
for frame, location, rotation, scale in poses:
    phone.location = location
    phone.rotation_euler = tuple(math.radians(value) for value in rotation)
    phone.scale = (scale, scale, scale)
    phone.keyframe_insert("location", frame=frame)
    phone.keyframe_insert("rotation_euler", frame=frame)
    phone.keyframe_insert("scale", frame=frame)

scene.camera = bpy.data.objects["WEB-HERO-camera"]
scene.camera.location = (0.0, -5.45, 0.06)
scene.camera.rotation_euler = (math.radians(88.7), 0.0, 0.0)
scene.frame_start = 1
scene.frame_end = 90
scene.render.fps = 30
scene.render.resolution_x = 300
scene.render.resolution_y = 560
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.render.film_transparent = True
scene.render.filepath = str(output_directory / "frame-")
bpy.ops.wm.save_as_mainfile(filepath=str(output_directory / "cadence-feedback-derived.blend"))
bpy.ops.render.render(animation=True)
