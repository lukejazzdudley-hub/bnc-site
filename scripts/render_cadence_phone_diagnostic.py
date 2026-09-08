import bpy
import math
import os


def srgb_channel_to_linear(value):
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


movie_path = os.environ["CADENCE_SCREEN_MOVIE"]
output_path = os.environ["CADENCE_DIAGNOSTIC_OUTPUT"]
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
image_node.image_user.frame_duration = 360

page_srgb = 8 / 255
page_linear = srgb_channel_to_linear(page_srgb)
page_color = (page_linear, page_linear, srgb_channel_to_linear(12 / 255), 1)
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
phone_root.rotation_euler = (math.radians(-1.5), math.radians(8), math.radians(-2))
phone_root.location = (0.04, 0.0, 0.0)
phone_root.scale = (1.03, 1.03, 1.03)
phone_root.animation_data_clear()

scene.camera = bpy.data.objects["WEB-HERO-camera"]
scene.camera.location = (0.0, -5.45, 0.08)
scene.camera.rotation_euler = (math.radians(88.7), 0.0, 0.0)
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 720
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "Medium High Contrast"
scene.render.filepath = output_path
scene.frame_set(90)
bpy.ops.render.render(write_still=True)
