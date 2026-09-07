import bpy
import math
import os
from pathlib import Path


def srgb_channel_to_linear(value):
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def keyframe(root, frame, *, x, z, tilt_x, turn_y, roll_z):
    root.location = (x, 0.0, z)
    root.rotation_euler = tuple(math.radians(value) for value in (tilt_x, turn_y, roll_z))
    root.keyframe_insert("location", frame=frame)
    root.keyframe_insert("rotation_euler", frame=frame)


movie_path = os.environ["CADENCE_SCREEN_MOVIE"]
frame_directory = Path(os.environ["CADENCE_PHONE_FRAME_DIR"])
frame_count = int(os.environ["CADENCE_FRAME_COUNT"])
motion = os.environ.get("CADENCE_PHONE_MOTION", "capture")
scene = bpy.context.scene

phone_root = bpy.data.objects["CTRL-F03V5-b01-v8-library"]
screen = bpy.data.objects["GEO-Cadence-real-screen-F03V5-b01-v8-library"]
phone_root.hide_render = False
screen.hide_render = False

for obj in bpy.data.objects:
    if obj.name.startswith(("CTRL-F03V5-b01-v8-beat-cta", "CTRL-F03V5-b01-v8-rhyme", "CTRL-iPhone-16-Pro")):
        obj.hide_render = True
    if obj.type in {"FONT", "CURVE"} or obj.name.startswith(("IMG-B01-", "GEO-B01-")):
        obj.hide_render = True

material = bpy.data.materials["MAT-F03V5-screen-b01-v8-library"]
image_node = next(node for node in material.node_tree.nodes if node.type == "TEX_IMAGE")
image = bpy.data.images.load(movie_path, check_existing=False)
image.source = "MOVIE"
image_node.image = image
image_node.image_user.use_auto_refresh = True
image_node.image_user.frame_start = 1
image_node.image_user.frame_duration = frame_count

page_srgb = 8 / 255
page_color = (
    srgb_channel_to_linear(page_srgb),
    srgb_channel_to_linear(9 / 255),
    srgb_channel_to_linear(12 / 255),
    1,
)
scene.world.color = page_color[:3]
for material_name in ("WEB-HERO-backdrop", "WEB-HERO-floor"):
    background = bpy.data.materials[material_name]
    for node in background.node_tree.nodes:
        if node.type == "EMISSION":
            node.inputs["Color"].default_value = page_color
            node.inputs["Strength"].default_value = 1.0
        if node.type == "BSDF_PRINCIPLED":
            node.inputs["Base Color"].default_value = page_color
            node.inputs["Roughness"].default_value = 0.88

bpy.data.objects["WEB-HERO-purposeful-device-plinth"].hide_render = True
bpy.data.objects["WEB-HERO-studio-floor"].hide_render = True
phone_root.animation_data_clear()
phone_root.scale = (1.03, 1.03, 1.03)

motions = {
    "hero": ((-0.02, -0.01, -1.0, 8.0, -1.8), (0.035, 0.02, -0.5, 4.5, -0.7)),
    "capture": ((-0.05, -0.02, -1.2, 10.0, -2.4), (0.04, 0.02, -0.4, 6.5, -1.2)),
    "rhyme": ((0.05, 0.01, -0.8, -7.5, 1.8), (-0.03, -0.01, -1.5, -4.0, 0.8)),
    "arrange": ((0.0, -0.01, -0.6, 3.0, -0.5), (0.02, 0.015, -1.0, 0.5, 0.35)),
    "finish": ((-0.03, 0.02, -1.4, 7.0, -1.5), (0.05, -0.01, -0.5, 3.5, -0.5)),
}
start, end = motions[motion]
keyframe(phone_root, 1, x=start[0], z=start[1], tilt_x=start[2], turn_y=start[3], roll_z=start[4])
keyframe(phone_root, frame_count, x=end[0], z=end[1], tilt_x=end[2], turn_y=end[3], roll_z=end[4])

scene.camera = bpy.data.objects["WEB-HERO-camera"]
scene.camera.location = (0.0, -5.45, 0.08)
scene.camera.rotation_euler = (math.radians(88.7), 0.0, 0.0)
scene.frame_start = 1
scene.frame_end = frame_count
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 720
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
frame_directory.mkdir(parents=True, exist_ok=True)
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.render.filepath = str(frame_directory / "frame-")
scene.render.film_transparent = True
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "Medium High Contrast"
bpy.ops.render.render(animation=True)
