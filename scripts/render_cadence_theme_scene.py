import argparse
import bpy
import hashlib
import json
import math
from pathlib import Path
import sys


THEME_KEYS = {
    "arctic": ((1, 1.0), (24, 1.0), (48, 0.0)),
    "neon": ((1, 0.0), (24, 0.0), (48, 1.0), (72, 1.0), (96, 0.0)),
    "crimson": ((1, 0.0), (72, 0.0), (96, 1.0), (120, 1.0)),
}


def arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--source-root", required=True, type=Path)
    parser.add_argument("--arctic", required=True, type=Path)
    parser.add_argument("--neon", required=True, type=Path)
    parser.add_argument("--crimson", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1:])


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_sources(options):
    manifest = json.loads(options.manifest.read_text(encoding="utf-8"))
    records = {record["theme"]: record for record in manifest["captures"]}
    paths = {theme: getattr(options, theme) for theme in THEME_KEYS}
    if set(records) != set(THEME_KEYS):
        raise ValueError("manifest must contain exactly Arctic, Neon and Crimson")
    for theme, path in paths.items():
        record = records[theme]
        if path.parent.resolve() != options.source_root.resolve():
            raise ValueError(f"{theme} is outside the locked source root")
        if path.name != record["source_basename"] or sha256(path) != record["sha256"]:
            raise ValueError(f"{theme} does not match the capture manifest")
        locked = (record["project"], record["screen"], record["control_state"], record["status_chrome"])
        if locked != ("signal-in-the-gold", "editor", "current-large-beat-play", False):
            raise ValueError(f"{theme} is not the approved editor state")
    return paths


def keyframe(input_socket, frame, value):
    input_socket.default_value = value
    input_socket.keyframe_insert("default_value", frame=frame)


options = arguments()
sources = validate_sources(options)
options.output_dir.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene

phone_root = bpy.data.objects["CTRL-F03V5-b01-v8-library"]
screen = bpy.data.objects["GEO-Cadence-real-screen-F03V5-b01-v8-library"]
phone_root.hide_render = False
screen.hide_render = False
for obj in bpy.data.objects:
    if obj.name.startswith(("CTRL-F03V5-b01-v8-beat-cta", "CTRL-F03V5-b01-v8-rhyme", "CTRL-iPhone-16-Pro")):
        obj.hide_render = True
    if obj.type in {"FONT", "CURVE"} or obj.name.startswith(("IMG-B01-", "GEO-B01-", "WEB-HERO-purposeful", "WEB-HERO-studio")):
        obj.hide_render = True

material = bpy.data.materials["MAT-F03V5-screen-b01-v8-library"]
material.use_nodes = True
nodes = material.node_tree.nodes
nodes.clear()
output = nodes.new("ShaderNodeOutputMaterial")
emission = nodes.new("ShaderNodeEmission")
emission.inputs["Strength"].default_value = 1.0
mix_arctic_neon = nodes.new("ShaderNodeMixRGB")
mix_final = nodes.new("ShaderNodeMixRGB")
textures = {}
for theme, path in sources.items():
    texture = nodes.new("ShaderNodeTexImage")
    texture.name = f"LOCKED-{theme}"
    texture.image = bpy.data.images.load(str(path), check_existing=False)
    texture.interpolation = "Linear"
    textures[theme] = texture

material.node_tree.links.new(textures["arctic"].outputs["Color"], mix_arctic_neon.inputs[1])
material.node_tree.links.new(textures["neon"].outputs["Color"], mix_arctic_neon.inputs[2])
material.node_tree.links.new(mix_arctic_neon.outputs["Color"], mix_final.inputs[1])
material.node_tree.links.new(textures["crimson"].outputs["Color"], mix_final.inputs[2])
material.node_tree.links.new(mix_final.outputs["Color"], emission.inputs["Color"])
material.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])

for frame, alpha in THEME_KEYS["neon"]:
    keyframe(mix_arctic_neon.inputs[0], frame, alpha)
for frame, alpha in THEME_KEYS["crimson"]:
    keyframe(mix_final.inputs[0], frame, alpha)

phone_root.animation_data_clear()
phone_root.location = (0.02, 0.0, 0.0)
phone_root.rotation_euler = tuple(math.radians(value) for value in (-0.8, 5.5, -1.0))
phone_root.scale = (1.03, 1.03, 1.03)
scene.camera = bpy.data.objects["WEB-HERO-camera"]
scene.camera.location = (0.0, -5.45, 0.08)
scene.camera.rotation_euler = (math.radians(88.7), 0.0, 0.0)
scene.frame_start = 1
scene.frame_end = 120
scene.render.engine = "BLENDER_EEVEE"
scene.render.fps = 30
scene.render.resolution_x = 1080
scene.render.resolution_y = 1350
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.render.film_transparent = True
scene.render.filepath = str(options.output_dir / "frame-")
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "Medium High Contrast"
bpy.ops.wm.save_as_mainfile(filepath=str(options.output_dir / "cadence-theme-scroll-derived.blend"))
bpy.ops.render.render(animation=True)
